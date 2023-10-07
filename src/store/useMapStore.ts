import router from '@/router';
import { Loader } from '@googlemaps/js-api-loader';
import { defineStore } from 'pinia';
import { Ref, reactive, ref } from 'vue';

export const useMapStore = defineStore('map', () => {
    const map: Ref<any> = ref([]);
    const geoLayer: Ref<any> = ref([]);
    const infoWindow: Ref<any> = ref([]);
    const locationButton: Ref<null | HTMLElement> = ref(null);

    const locationIsSelected: Ref<boolean> = ref(false);

    const registerFire = reactive({
        reportBy: '',
        riskInNeighbourhood: '',
        fireSeverity: '',
        position: {
            lat: 0,
            lng: 0,
        },
        date: new Date(),
    });
    // TODO: criar array com todos os registro de fogo ou exportar kml e reimportar no mapa

    const fireLocations = reactive({});

    const initialLocal = reactive({
        lat: -34.397,
        lng: 150.644,
    });

    const mapOptions = {
        center: { lat: initialLocal.lat, lng: initialLocal.lng },
        zoom: 6,
        language: 'en',
        disableDefaultUI: true,
        zoomControl: true,
    };

    function handleLocationError(
        browserHasGeolocation: boolean,
        infoWindow: google.maps.InfoWindow,
        pos: google.maps.LatLng,
    ) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(
            browserHasGeolocation
                ? 'Error: The Geolocation service failed.'
                : "Error: Your browser doesn't support geolocation.",
        );
        infoWindow.open(map.value);
    }

    const setCurrentLocation = () => {
        locationIsSelected.value = false;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position: GeolocationPosition) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };

                    infoWindow.value.setPosition(pos);
                    infoWindow.value.setContent('Location found.');
                    infoWindow.value.open(map.value);
                    map.value.setCenter(pos);
                    map.value.setZoom(18);
                },
                () => {
                    handleLocationError(true, infoWindow.value, map.value.getCenter()!);
                },
            );
        } else {
            handleLocationError(false, infoWindow.value, map.value.getCenter()!);
        }
    };

    const addNewPoint = (mapsMouseEvent: any) => {
        // Close the current InfoWindow.
        infoWindow.value.close();
        // Create a new InfoWindow.
        infoWindow.value = new google.maps.InfoWindow({
            position: mapsMouseEvent.latLng,
        });

        registerFire.position = {
            lat: Number(mapsMouseEvent.latLng.toJSON().lat),
            lng: Number(mapsMouseEvent.latLng.toJSON().lng),
        };

        locationIsSelected.value = true;

        // Salvar latitude e longitude no store para o novo ponto
        infoWindow.value.setContent('Selected fire location');
        infoWindow.value.open(map.value);
    };

    const startMap = async (divMap: HTMLElement) => {
        const loader = new Loader({
            apiKey: import.meta.env.VITE_API_GOOGLE_MAPS_KEY,
            version: 'weekly',
        });

        await loader
            .importLibrary('maps')
            .then(({ Map, KmlLayer, InfoWindow, StyledMapType }) => {
                map.value = new Map(divMap, mapOptions);

                geoLayer.value = new KmlLayer({
                    url: 'https://firms.modaps.eosdis.nasa.gov/data/active_fire/noaa-20-viirs-c2/kml/J1_VIIRS_C2_Canada_24h.kml',
                });
                geoLayer.value.setMap(map.value);

                infoWindow.value = new InfoWindow();

                /*
                    // Dados JSON com informações dos marcadores
                    var marcadores = [
                    {
                        latitude: -34.397,
                        longitude: 150.644,
                        title: "Marcador 1"
                    },
                    {
                        latitude: -33.867,
                        longitude: 151.209,
                        title: "Marcador 2"
                    },
                    {
                        latitude: -35.282,
                        longitude: 149.128,
                        title: "Marcador 3"
                    }
                    ];

                    // Loop para criar marcadores
                    for (var i = 0; i < marcadores.length; i++) {
                        var marcador = marcadores[i];
                        var marker = new google.maps.Marker({
                            position: { lat: marcador.latitude, lng: marcador.longitude },
                            map: map,
                            title: marcador.title
                        });
                    }
                }
                */

                if (router.currentRoute.value.name === 'ReportFire') {
                    map.value.addListener('click', addNewPoint);
                }

                // new StyledMapType({

                // })
            })
            .catch((e) => {
                console.debug('🟣 ~ file: MapWithFireBase.vue:102 ~ .then ~ e:', e);
            });
    };

    const createNewMarkerWithInfo = (details: Record<string, string | number>) => {
        infoWindow.value.close();
        const marker = new google.maps.Marker({
            position: {
                lat: registerFire.position.lat,
                lng: registerFire.position.lng,
            },
            map: map.value,
            title: 'test',
            // icon
        });

        // Referencias para testar:
        // https://developers.google.com/maps/documentation/javascript/marker-clustering

        // TODO: Adicionar dados do banco de dados
        const dataToShow = ref(`
            Reported by NASA / ${details.reportBy}
            Risk in neighbourhood: ${details.riskInNeighbourhood}
        `);

        infoWindow.value.setContent(
            `Selected fire location sdf sdf sdf sdf sdf sdf 
            sdf sdffffffffffs sdf sdf sdf sdf sd sd fsdf sd 
            sdfsdfsddddddddddddddd`,
        );
        infoWindow.value.setPosition({
            lat: registerFire.position.lat,
            lng: registerFire.position.lng,
        });
        // marker.setIcon(prop.iconImage);
        marker.setMap(map.value);
        marker.addListener('click', () => {
            infoWindow.value.open(map.value, marker);
        });
    };

    const saveDataOfRegisterFire = (details: Record<string, string>) => {
        // TODO: Salvar dados:
        registerFire.riskInNeighbourhood =
            details.riskInNeighbourhood || 'No details reported';
        registerFire.reportBy = details.reportBy;
        registerFire.fireSeverity = details.fireSeverity;

        // TODO: Gerar nova data

        const currentData = new Date();
        const dataUtc = Date.UTC(
            currentData.getFullYear(),
            currentData.getMonth(),
            currentData.getDate(),
            currentData.getHours(),
            currentData.getMinutes(),
            currentData.getSeconds(),
        );
        console.debug(
            '🟣 ~ file: useMapStore.ts:212 ~ saveDataOfRegisterFire ~ dataUtc:',
            dataUtc,
        );

        // createNewMarkerWithInfo(details);

        // TODO: Exibir modal de confirmação e mudar para a página inicial
        // Texto do modal: Report Saved! We communicated to the authorities in the region to combat the fire
    };

    return {
        map,
        geoLayer,
        infoWindow,
        locationButton,
        fireLocations,
        registerFire,
        locationIsSelected,
        createNewMarkerWithInfo,
        setCurrentLocation,
        startMap,
        saveDataOfRegisterFire,
    };
});
