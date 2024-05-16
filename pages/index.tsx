import type { NextPage } from 'next';
import {
  Box,
  Button,
  Divider,
  Fade,
  FormControl,
  IconButton,
  InputLabel,
  Link as MuiLink,
  MenuItem,
  Modal,
  Pagination,
  Select,
  SelectChangeEvent,
  Tooltip,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { useTheme } from '@mui/system';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import {
  format,
  getDay,
  getTime,
  isWithinInterval,
  setHours,
  setMinutes
} from 'date-fns';
import { DateTimePicker } from '@mui/x-date-pickers';
import { clsx } from 'clsx';
import {
  CommonAttributes,
  DaysOfWeek,
  Language,
  languages,
  ModalDetailsData
} from '../src/types/common';
import Image from 'next/image';

// 103 - Bars and lounges in the Zurich region
// 101 - Eating out in Zurich
// 96 - Culture in the Zurich region
// 136 - Museums in the Zurich region
/// 162 - Nightlife: clubs in Zurich

const CATEGORIESTODISPLAY = ['103', '101', '96', '136', '162'];

const daysOfWeekMap: DaysOfWeek = {
  Su: 0,
  Mo: 1,
  Tu: 2,
  We: 3,
  Th: 4,
  Fr: 5,
  Sa: 6
};

type CategoryDataState = {
  [key: string]: CommonAttributes[];
};

const Home: NextPage = () => {
  const theme = useTheme();

  const [categoryData, setCategoryData] = useState<CategoryDataState>({});
  const [closedObjectData, setClosedObjectData] = useState<CategoryDataState>(
    {}
  );

  const [expandedCategories, setExpandedCategories] = useState<{
    [key: string]: boolean;
  }>({});
  const [expandedClosedCategories, setExpandedClosedCategories] = useState<{
    [key: string]: boolean;
  }>({});

  const [searchTime, setSearchTime] = useState(new Date());
  const [onlyShowOpen, setOnlyShowOpen] = useState(false);

  const [initalLoadingDone, setInitalLoadingDone] = useState(false);

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [modalDetailsData, setModalDetailsData] =
    useState<ModalDetailsData | null>(null);

  const [page, setPage] = useState<{
    [key: string]: number;
  }>({});
  const [pageSize, setPageSize] = useState(3);
  const [totalPages, setTotalPages] = useState(1);

  const [currentLanguage, setCurrentLanguage] = useState<Language>(
    languages[0]
  );

  const [favorites, setFavorites] = useState<string[]>([]);

  // Handler to update the languages when the user changes the selection
  const handleLanguageChange = (
    event: SelectChangeEvent<'fr' | 'de' | 'en' | 'it'>
  ) => {
    const selectedShortName = event.target
      .value as Language['languageShortName'];
    const selectedLanguage = languages.find(
      (lang) => lang.languageShortName === selectedShortName
    );

    // Ensure the selected languages is found before updating the state
    if (selectedLanguage) {
      setCurrentLanguage(selectedLanguage);
    }
  };

  const isFavourite = (name: string): boolean => {
    return favorites.includes(name);
  };

  const addFavorite = (key: string | undefined): void => {
    if (key == undefined) return;
    setFavorites((prevFavorites) => [...prevFavorites, key]);
    localStorage.setItem("favorites", favorites.toString());
  };

  const removeFavorite = (key: string | undefined): void => {
    if (key == undefined) return;
    setFavorites((prevFavorites) => prevFavorites.filter((fav) => fav !== key));
    localStorage.setItem("favorites", favorites.toString());
    
  };

  const checkOpen = (openingHours: string[], currentDate: Date) => {
    const currentDayIndex = getDay(currentDate);

    for (const period of openingHours) {
      const [days, times] = period.split(' ');
      const [startTime, endTime] = times.split('-');

      if (
        days.split(',').some((day) => daysOfWeekMap[day] === currentDayIndex)
      ) {
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        const [endHours, endMinutes] = endTime.split(':').map(Number);

        // Adjust for "00:00:00" as end time meaning end of the day (24:00)
        const adjustedEndHours =
          endHours === 0 && endMinutes === 0 ? 24 : endHours;

        const startDate = setMinutes(
          setHours(currentDate, startHours),
          startMinutes
        );
        const endDate = setMinutes(
          setHours(currentDate, adjustedEndHours),
          endMinutes
        );

        if (isWithinInterval(currentDate, { start: startDate, end: endDate })) {
          return true;
        }

        // Handle overnight hours by checking if the current time is after the start time and before midnight or after midnight and before the end time.
        if (startHours > adjustedEndHours) {
          const endOfToday = setMinutes(setHours(currentDate, 23), 59);
          const startOfToday = setMinutes(setHours(currentDate, 0), 0);
          if (
            isWithinInterval(currentDate, {
              start: startDate,
              end: endOfToday
            }) ||
            isWithinInterval(currentDate, { start: startOfToday, end: endDate })
          ) {
            return true;
          }
        }
      }
    }

    return false;
  };

  const fetchAndFilterDataByDate = async (date: Date) => {
    const newDisplayData = { ...categoryData };
    const newClosedData = { ...categoryData };

    Object.keys(categoryData).forEach((categoryID) => {
      const data = categoryData[categoryID];

      if (data) {
        const openData = data.filter((category: CommonAttributes) => {
          if (category.openingHours) {
            return checkOpen(category.openingHours, date);
          } else {
            return true;
          }
        });

        const closedData = data.filter((category: CommonAttributes) => {
          if (category.openingHours) {
            return !checkOpen(category.openingHours, date);
          } else {
            return false;
          }
        });

        newDisplayData[categoryID] = openData;
        newClosedData[categoryID] = closedData;
      }
    });

    setCategoryData(newDisplayData);
    setClosedObjectData(newClosedData);
    setOnlyShowOpen(true);
  };

  useEffect(() => {
    const fetchAllCategories = async () => {
      const fetchPromises = CATEGORIESTODISPLAY.map((categoryID) =>
        fetch(`https://www.zuerich.com/en/api/v2/data?id=${categoryID}`).then(
          (res) => res.json()
        )
      );
      try {
        const results = await Promise.all(fetchPromises);
        const newData: {
          [key: string]: CommonAttributes[];
        } = {};
        CATEGORIESTODISPLAY.forEach((categoryID, index) => {
          newData[categoryID] = results[index];
        });
        setCategoryData(newData);
        setInitalLoadingDone(true);
      } catch (err) {
        console.log(err);
      }
    };

    if (!initalLoadingDone) {
      fetchAllCategories();
    }

    let fav : string | null = localStorage.getItem("favorites")
    if( fav === null) return
    setFavorites(fav.split(','))
  }, []);

  return (
    <>
      <title>{currentLanguage.title}</title>
      <Modal
        disableAutoFocus
        disableEnforceFocus
        disablePortal
        open={showDetailsModal}
      >
        <Fade in={showDetailsModal} timeout={200}>
          <Box
            bgcolor="dimgrey"
            className={clsx(
              `absolute top-1/2 left-1/2 xs:w-[90%] md:w-auto md:min-w-[40rem] min-w-[20rem]  px-4 py-8
            transform translate-x-[-50%] translate-y-[-50%] flex flex-col rounded-md overflow-y-auto max-h-[90%] max-w-[55%]`
            )}
          >
            <div>
              <div className="absolute right-2 top-8">
                <IconButton onClick={() => setShowDetailsModal(false)}>
                  <Icon icon={'ci:close-big'} width={50} height={50} />
                </IconButton>
              </div>
              <Typography
                paddingX={2}
                variant="h2"
                textAlign="center"
                component="p"
              >
                {modalDetailsData?.name}
              </Typography>
              <Divider variant="middle" sx={{ m: 4 }} />
            </div>
            <Box
              display={'flex'}
              flexDirection={'column'}
              justifyContent="center"
            >
              <Typography variant="h4" textAlign="center" m={2}>
                {modalDetailsData?.address?.streetAddress}{' '}
                {modalDetailsData?.address?.postalCode}{' '}
                {modalDetailsData?.address?.addressLocality}{' '}
                {modalDetailsData?.address?.addressCountry}
              </Typography>

              <Typography
                variant="h6"
                textAlign="center"
                color={
                  checkOpen(modalDetailsData?.openingHours || [], new Date())
                    ? 'darkgreen'
                    : 'darkred'
                }
                m={2}
              >
                {currentLanguage.opening_hours}:{' '}
                {modalDetailsData?.openingHours.toString()}
              </Typography>

              <img
                src={modalDetailsData?.image}
                alt={modalDetailsData?.name}
                style={{ width: '500px', height: '500px', margin: '0 auto' }}
              />
              <Box display="grid" m={4}>
                <ReactMarkdown
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    a: ({ ...props }) => (
                      <MuiLink
                        href={props.href}
                        sx={{
                          color: 'blue',
                          textDecoration: 'underline'
                        }}
                      >
                        {props.children}
                      </MuiLink>
                    )
                  }}
                >
                  {modalDetailsData?.description}
                </ReactMarkdown>
              </Box>
            </Box>
          </Box>
        </Fade>
      </Modal>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        width="100%"
        justifyContent="center"
      >
        <Typography variant="h1" mb={4}>
          {currentLanguage.title}
        </Typography>
        <Box display={'flex'} alignItems={'center'} gap={2}>
          <Divider sx={{ m: 2 }} />
          <Box display="grid" gap={2}>
            <Typography variant="h3">
              {currentLanguage.your_selected_time}:{' '}
              {format(searchTime, 'dd.MM.yyyy hh:mm')}
            </Typography>
            <DateTimePicker
              value={searchTime}
              onChange={(newValue) => {
                setSearchTime(newValue as Date);
              }}
              label="Select Time"
              slotProps={{
                textField: {
                  helperText: 'Select your time'
                }
              }}
              sx={{
                width: '100%'
              }}
            />
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => fetchAndFilterDataByDate(searchTime)}
            >
              {currentLanguage.show_only_open_stores_at_the_selected_time}
            </Button>
          </Box>
          <Box display="grid" gap={2}>
            <Typography variant="h3">
              {currentLanguage.configurations}
            </Typography>
            <FormControl fullWidth>
              <InputLabel id="page-size-select">
                {currentLanguage.select_the_page_size}
              </InputLabel>
              <Select
                sx={{ width: '200px' }}
                value={pageSize}
                onChange={(event) => {
                  setPageSize(event.target.value as number);
                }}
                data-testid="page-size-select"
              >
                <MenuItem value={3} data-testid={'page-size-3'}>
                  3
                </MenuItem>
                <MenuItem value={5} data-testid={'page-size-5'}>
                  5
                </MenuItem>
                <MenuItem value={10} data-testid={'page-size-10'}>
                  10
                </MenuItem>
              </Select>
            </FormControl>
            <Typography variant="h3">{currentLanguage.language}</Typography>
            <FormControl fullWidth>
              <InputLabel id="page-size-select">
                {currentLanguage.select_the_language}
              </InputLabel>
              <Select
                sx={{ width: '200px' }}
                value={currentLanguage.languageShortName}
                onChange={(event) => {
                  handleLanguageChange(
                    event as SelectChangeEvent<'fr' | 'de' | 'en' | 'it'>
                  );
                }}
                data-testid="language-select"
              >
                {languages.map((lang) => (
                  <MenuItem
                    key={lang.languageShortName}
                    value={lang.languageShortName}
                    data-testid={'language-' + lang.languageShortName}
                  >
                    {lang.languageName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Divider sx={{ m: 2 }} />
        </Box>
        {CATEGORIESTODISPLAY.map((categoryID, index) => {
          return (
            <Box
              key={index}
              sx={{
                marginTop: '2rem',
                padding: '2rem',
                borderRadius: '15px',
                width: '100%',
                boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.3)'
              }}
            >
              <Box
                width="100%"
                display={'flex'}
                justifyContent={'space-between'}
                alignItems="center"
              >
                <Typography color="primary" variant="h2">
                  {
                    // @ts-expect-error not able to check if category is in name_to_category
                    currentLanguage.name_to_category[parseInt(categoryID)]
                  }
                </Typography>
                <Box display="flex" alignItems="center" gap={4}>
                  {categoryData[categoryID] && onlyShowOpen && (
                    <Typography color="success" variant="h4">
                      {categoryData[categoryID].length}{' '}
                      {currentLanguage.open_stores}
                    </Typography>
                  )}

                  {categoryData[categoryID] && !onlyShowOpen && (
                    <Typography color="success" variant="h4">
                      {categoryData[categoryID].length} {currentLanguage.stores}
                    </Typography>
                  )}
                  <Tooltip
                    title={
                      expandedCategories[categoryID]
                        ? currentLanguage.collapse
                        : currentLanguage.expand
                    }
                    placement={'top'}
                  >
                    <IconButton
                      onClick={() => {
                        setPage((prev) => ({
                          ...prev,
                          [categoryID]: 1
                        }));
                        setTotalPages(
                          Math.ceil(
                            categoryData[categoryID]?.length / pageSize || 1
                          )
                        );
                        setExpandedCategories((prev) => ({
                          ...prev,
                          [categoryID]: !prev[categoryID]
                        }));
                      }}
                      data-testid={
                        expandedCategories[categoryID]
                          ? `collapse-button-${categoryID}`
                          : `expand-button-${categoryID}`
                      }
                    >
                      <Icon
                        width={30}
                        height={30}
                        color={theme.palette.text.secondary}
                        icon={
                          expandedCategories[categoryID]
                            ? 'material-symbols-light:expand-more-rounded'
                            : 'material-symbols-light:expand-less-rounded'
                        }
                      />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              {categoryData[categoryID] &&
                expandedCategories[categoryID] &&
                categoryData[categoryID]
                  .slice(
                    (page[categoryID] - 1) * pageSize,
                    page[categoryID] * pageSize
                  )
                  .map((element: CommonAttributes, index: number) => {
                    return (
                      <>
                        {!isFavourite(element.name.en!) ? (
                          <IconButton
                            onClick={() => {
                              addFavorite(element.name.en);
                              element.isFavourite = true;
                            }}
                          >
                            <Icon
                              width={30}
                              height={30}
                              color={theme.palette.text.secondary}
                              data-testid={`heart-light`}
                              icon={'ph:heart-light'}
                            />
                          </IconButton>
                        ) : (
                          <IconButton
                            onClick={() => {
                              removeFavorite(element.name.en);
                              element.isFavourite = false;
                            }}
                          >
                            <Icon
                              width={30}
                              height={30}
                              color={theme.palette.text.secondary}
                              data-testid={`heart-fill`}
                              icon={'ph:heart-fill'}
                            />
                          </IconButton>
                        )}

                        <Box
                          aria-label={`store-element`}
                          key={index}
                          padding={2}
                          width="100%"
                          display="flex"
                          flexDirection="column"
                          justifyContent="center"
                          onClick={() => {
                            setModalDetailsData({
                              name:
                                element.name[
                                  currentLanguage.languageShortName
                                ] || '',
                              description:
                                element.description[
                                  currentLanguage.languageShortName
                                ] || '',
                              image: element?.image?.url || '',
                              address: element.address,
                              openingHours: element.openingHours
                            });
                            setShowDetailsModal(true);
                          }}
                        >
                          <Typography textAlign="center" mb={2} variant="h4">
                            {element.name[currentLanguage.languageShortName]}
                          </Typography>

                          <Box display="flex">
                            <Image
                              src={element?.image?.url ?? ''}
                              alt={
                                element.name[
                                  currentLanguage.languageShortName
                                ] ?? 'Image Alt'
                              }
                              width={250}
                              height={250}
                            />
                            <Divider sx={{ m: 2 }} />
                            <Box display="grid">
                              <ReactMarkdown
                                rehypePlugins={[rehypeRaw]}
                                components={{
                                  a: ({ ...props }) => (
                                    <MuiLink
                                      href={props.href}
                                      sx={{
                                        color: 'blue',
                                        textDecoration: 'underline'
                                      }}
                                    >
                                      {props.children}
                                    </MuiLink>
                                  )
                                }}
                              >
                                {
                                  element.description[
                                    currentLanguage.languageShortName
                                  ]
                                }
                              </ReactMarkdown>
                            </Box>
                          </Box>
                          {index !== categoryData[categoryID].length - 1 && (
                            <Divider sx={{ m: 2 }} />
                          )}
                        </Box>
                      </>
                    );
                  })}
              {expandedCategories[categoryID] && (
                <Box display="flex" justifyContent="center">
                  <Pagination
                    count={Math.ceil(
                      categoryData[categoryID]?.length / pageSize || 1
                    )}
                    page={page[categoryID]}
                    onChange={(event, value) => {
                      setPage((prev) => ({
                        ...prev,
                        [categoryID]: value
                      }));
                    }}
                    data-testid={`pagination-${categoryID}`}
                    variant="outlined"
                    shape="rounded"
                    size="small"
                  />
                </Box>
              )}
            </Box>
          );
        })}
        {onlyShowOpen && (
          <Box width="100%">
            <Typography variant="h3" mt={4} mb={4}>
              {currentLanguage.closed_stores}
            </Typography>
            {CATEGORIESTODISPLAY.map((categoryID) => {
              return (
                <Box
                  sx={{
                    marginTop: '2rem',
                    padding: '2rem',
                    borderRadius: '15px',
                    width: '100%',
                    boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.8)'
                  }}
                >
                  <Box
                    width="100%"
                    display={'flex'}
                    justifyContent={'space-between'}
                    alignItems="center"
                  >
                    <Typography color="primary" variant="h2">
                      {
                        // @ts-expect-error not able to check if category is in name_to_category
                        currentLanguage.name_to_category[parseInt(categoryID)]
                      }{' '}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={4}>
                      {closedObjectData[categoryID] && (
                        <Typography color="success" variant="h4">
                          {closedObjectData[categoryID].length}{' '}
                          {currentLanguage.closed_stores}
                        </Typography>
                      )}
                      <Tooltip
                        title={
                          expandedCategories[categoryID] ? 'Collapse' : 'Expand'
                        }
                        placement={'top'}
                      >
                        <IconButton
                          onClick={() => {
                            setExpandedClosedCategories((prev) => ({
                              ...prev,
                              [categoryID]: !prev[categoryID]
                            }));
                          }}
                        >
                          <Icon
                            width={30}
                            height={30}
                            color={theme.palette.text.secondary}
                            icon={
                              expandedClosedCategories[categoryID]
                                ? 'material-symbols-light:expand-more-rounded'
                                : 'material-symbols-light:expand-less-rounded'
                            }
                          />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  {closedObjectData[categoryID] &&
                    expandedClosedCategories[categoryID] &&
                    closedObjectData[categoryID].map(
                      (element: any, index: number) => (
                        <Box
                          key={index}
                          padding={2}
                          width="100%"
                          display="flex"
                          flexDirection="column"
                          justifyContent="center"
                          data-testid={`closed-store-${index}`}
                          onClick={() => {
                            setModalDetailsData({
                              name: element.name[
                                currentLanguage.languageShortName
                              ],
                              description:
                                element.description[
                                  currentLanguage.languageShortName
                                ],
                              image: element.image.url,
                              address: element.address,
                              openingHours: element.openingHours
                            });
                            setShowDetailsModal(true);
                          }}
                        >
                          <Typography textAlign="center" mb={2} variant="h4">
                            {element.name[currentLanguage.languageShortName]}
                          </Typography>
                          <Box display="flex">
                            <img
                              src={element.image.url}
                              alt={
                                element.name[currentLanguage.languageShortName]
                              }
                              style={{ width: '250px', height: '250px' }}
                            />
                            <Divider sx={{ m: 2 }} />
                            <Box display="grid">
                              <ReactMarkdown
                                rehypePlugins={[rehypeRaw]}
                                components={{
                                  a: ({ ...props }) => (
                                    <MuiLink
                                      href={props.href}
                                      sx={{
                                        color: 'blue',
                                        textDecoration: 'underline'
                                      }}
                                    >
                                      {props.children}
                                    </MuiLink>
                                  )
                                }}
                              >
                                {
                                  element.description[
                                    currentLanguage.languageShortName
                                  ]
                                }
                              </ReactMarkdown>
                            </Box>
                          </Box>
                          {index !== categoryData[categoryID].length - 1 && (
                            <Divider sx={{ m: 2 }} />
                          )}
                        </Box>
                      )
                    )}
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    </>
  );
};

export default Home;
