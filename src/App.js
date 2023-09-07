import { Container } from '@mui/material';
import './App.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import "moment/min/locales";

import { useTranslation } from 'react-i18next';

import Typography from '@mui/material/Typography';
import CloudIcon from '@mui/icons-material/Cloud';
import Button from '@mui/material/Button';




const theme = createTheme({
  typography: {
    fontFamily: ["Alexandria"],
  },
});

let cancelAxios = null;

function App() {
  const { t, i18n } = useTranslation();
  // console.log("the time is: "+ dateAndTime);
  const [dateAndTime, setDateAndTime] = useState("")
  const [temp, setTemp] = useState({
    number: null,
    description: "",
    min: null,
    max: null,
    icon: "",
  });
  const [locale, setLocale] = useState("ar")
  
    function handleLanguageClick() {
      locale === "ar" ? setLocale("en") : setLocale("ar"); 
    }

  useEffect(() => {
    i18n.changeLanguage(locale);
    moment.locale(locale);
    setDateAndTime(moment().format('MMMM Do YYYY, h:mm:ss a'));
  },[handleLanguageClick]);

  useEffect(() => {
      axios.get('https://api.openweathermap.org/data/2.5/weather?lat=33.57&lon=7.58&appid=dfbea6a9e7783973b6d12d5417c99fdb',{
        cancelToken: new axios.CancelToken((c) => {
          cancelAxios = c;
        })
      })
        .then(function (response) {
          // handle success
          const number = Math.round(response.data.main.temp - 273.15);
          const min = Math.round(response.data.main.temp_min - 273.15);
          const max = Math.round(response.data.main.temp_max - 273.15);
          const description = response.data.weather[0].description;
          const icon = response.data.weather[0].icon;

          console.log(number, min, max, description, icon);

          setTemp({number, description, min, max, icon: `https://openweathermap.org/img/wn/${icon}@2x.png`,});
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
        .finally(function () {
          // always executed
          console.log("finaly");
        });

        return () => {
          console.log("cancele token: ");
          cancelAxios();
        }
  },[])

  return (
    <div className="App" style={{ background: "#42a5f5" }}>
      <ThemeProvider theme={theme} >
          <Container maxWidth="sm" style={{}} >
            {/* content container */}
            <div style={{ 
              height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
             }}>
            {/* Card */}
            <div dir={ locale == "ar" ? "rtl" : "ltr"}
            style={{ 
              width: "100%",
              background: "rgb(28 52 91 / 36%)",
              color: "white",
              padding: "10px",
              borderRadius: "15px",
              boxShadow: "0px 7px 1px rgba(0, 0, 0, 0.05)",
             }}>
              {/* content */}
              <div>
                  {/* city and time */}
                  <div
                    style={{ 
                      display: "flex",
                      alignItems: "end",
                      justifyContent: "start",


                     }} 
                     dir={ locale == "ar" ? "rtl" : "ltr"}
                  >
                    <Typography variant="h3" style={{ marginRight: "20px", fontWeight: "600" }}>
                    {t("Casablanca")}{/* الدار البيضاء */}
                    </Typography>
                    <Typography variant="h6" style={{ marginRight: "20px", fontWeight: "300" ,}}>
                    {dateAndTime}
                    </Typography>
                  </div>
                  {/*== city and time ==*/}
                  <hr/>

                  {/* Container of degree + Cloud Icon */}
                  <div style={{ display: "flex", justifyContent: "space-around" }}>
                    {/* Details */}
                    <div>
                      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Typography variant="h2" style={{ textAlign: "right" }}>
                          {temp.number}
                        </Typography>

                        {/* TODO: Temprture Image */}
                        <img src={temp.icon}/>
                      </div>

                      <Typography variant="h6">
                        { t(`${temp.description}`) }
                      </Typography>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", }}>
                        <h5>{ t("min") }: {temp.min}</h5>
                        <h5 style={{ margin: "0px 5px" }}>|</h5>
                        <h5>{ t("max") }: {temp.max}</h5>
                      </div>
                    </div>
                    {/*== Details ==*/}

                    <CloudIcon style={{ fontSize: "200px", color: "white" }} />
                    </div>
                  {/*== Container of degree + Cloud Icon ==*/}
              </div>
              {/*=== content ===*/}
            </div>
            {/*=== Card ===*/}
              <div style={{ width: "100%", display: "flex", justifyContent: "end", marginTop: "10px" }} dir={ locale == "ar" ? "rtl" : "ltr"}>
                <Button onClick={handleLanguageClick} variant="text" style={{ color: "white", fontWeight: "300" }}>
                  { locale == "ar" ? "إنجليزي" : "Arabic"}
                </Button>
              </div>
            </div>
            {/*== content container ==*/}
          </Container>
      </ThemeProvider>
    </div>
  );
}

export default App;
// https://api.openweathermap.org/data/2.5/weather?lat=33.58&lon=10.99&appid=dfbea6a9e7783973b6d12d5417c99fdb