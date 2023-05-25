$(function () {
    const cityInput = $("#city");
    const stateInput = $("#state");
    const searchbtn = $('#search');
    const buttonsContainer = $('#buttons-container');
    const topHalf = $('#topHalf');
    const bottomHalf = $('#bottomHalf');
    
    let todayBox;
    let city = '';
    let state = '';
    let lat = '';
    let lon = '';
    let date;
    let formatDate;
    let icon = '';
    let iconLink = '';
    let temp = '';
    let wind = '';
    let hum = '';

    cityInput.add(stateInput).on('input', function () {

        if (cityInput.val().trim() !== '' && stateInput.val().trim() !== '') {
            
            searchbtn.removeClass('is-hidden');
        } else {
            
            searchbtn.addClass('is-hidden');
        }
    });

    searchbtn.on('click keydown', function (event) {

        if (event.type === 'click' || event.key === 'Enter') {

            city = cityInput.val().trim();
            state = stateInput.val().trim().toUpperCase();

            localStorage.setItem('city', city);
            localStorage.setItem('state', state);


            if (buttonsContainer.children().length >= 13) {
                buttonsContainer.children().first().remove();
            }

            let newButton = $('<button>').addClass('button is-light is-medium is-fullwidth mb-2').text(city).attr('id', city).attr('data-state', state);

            buttonsContainer.append(newButton);
            geoLocate();


        }
    });


    function geoLocate() {
        fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city},${state}&limit=1&appid=c399aac8bfa3d05f4f0807f4c623fc1d`)
            .then(response => response.json())
            .then(function (data) {

                console.log(data);

                lat = data[0].lat.toString().trim();
                lon = data[0].lon.toString().trim();

                today();

            })
            .catch(err => console.error(err));
    }

    function today() {
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=c399aac8bfa3d05f4f0807f4c623fc1d`)
            .then(response => response.json())
            .then(function (data) {   
                console.log(data);

                if (todayBox === undefined) {
                    todayBox = $('<div>').attr('id', 'todayBox row').addClass("box mt-4");
                    topHalf.append(todayBox);
                }

                icon = data.weather[0].icon;
                iconLink = `https://openweathermap.org/img/w/${icon}.png`;

                temp = data.main.temp;
                wind = data.wind.speed;
                hum = data.main.humidity;

                date = dayjs.unix(parseInt(data.dt));
                formatDate = date.format('DD/MM/YYYY');



                if (todayBox.children().length !== 0) {
                    todayBox.empty();
                }

                todayBox.append(`<h2 class="subtitle is-2 mb-4">
                            <b>${city} (${formatDate}) </b> 
                            <span class="icon is-large">
                                <img src = ${iconLink}>
                            </span>
                        </h2>
                        <h4 class="subtitle is-4">Temp: ${temp}°F</h4>
                        <h4 class="subtitle is-4">Wind: ${wind}MPH</h4>
                        <h4 class="subtitle is-4">Humidity: ${hum}%</h4>`);

                fiveDayForcast();

            })
            .catch(err => console.error(err));
    }

   

    function fiveDayForcast() {
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=c399aac8bfa3d05f4f0807f4c623fc1d`)
            .then(response => response.json())
            .then(function (data) {

                console.log(data);

                if (bottomHalf.children().length === 0) {
                    bottomHalf.append(`<h3 class="subtitle is-2 mt-5" id="bottomTitle">5-Day Forecast (at 12PM):</h3>
            <div class="level is-mobile is-multiline is-justify-content-space-between " id='cardSpace'></div>`);

                }

                let space = $('#cardSpace');

                if (space.children().length !== 0) {
                    space.empty();
                }

                for (let i = 2; i < 35; i += 8) {

                    temp = data.list[i].main.temp;
                    wind = data.list[i].wind.speed;
                    hum = data.list[i].main.humidity;

                    
                    date = dayjs.unix(parseInt(data.list[i].dt));
                    formatDate = date.format('DD/MM/YY');

                    icon = data.list[i].weather[0].icon;
                    iconLink = `https://openweathermap.org/img/w/${icon}.png`;

                    space.append(`<div class="column is-2" id="weatherCards">
                            <div class="card has-background-grey-light">
                                <div class="card-content">
                                    <div class="header-with-icon">
                                        <h2 class="title is-4">${formatDate}</h2>
                                    </div>
                                    <span class=" is-large">
                                            <img src= ${iconLink}></img>
                                    </span>
                                    <p class="content is-medium">Temp: ${temp}°F</p>
                                    <p class="content is-medium">Wind: ${wind}MPH</p>
                                    <p class="content is-medium">Humidity: ${hum}%</p>
                                </div>
                            </div>`)
                }

            })
            .catch(err => console.error(err));
    }

   
    $('#buttons-container').on('click', 'button', function () {

        city = $(this).attr('id');
        state = $(this).data('state');

        geoLocate();
    });
})