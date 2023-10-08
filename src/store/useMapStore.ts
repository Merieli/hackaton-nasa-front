import iconFire from '@/assets/fire-25px.png';
import router from '@/router';
import { Loader } from '@googlemaps/js-api-loader';
import axios from 'axios';
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
        date: '',
    });

    const allMarkers: Ref<Record<string, string | number>[]> = ref([]);

    const fireLocations = ref({});

    const initialLocal = reactive({
        lat: -11.22576249341531,
        lng: -49.73723689584582,
    });

    const mapOptions = reactive({
        center: { lat: initialLocal.lat, lng: initialLocal.lng },
        zoom: 6,
        language: 'en',
        disableDefaultUI: true,
        zoomControl: true,
        mapId: '4504f8b37365c3d0',
    });

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
                    map.value.setZoom(12);
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
        infoWindow.value.close();
        infoWindow.value = new google.maps.InfoWindow({
            position: mapsMouseEvent.latLng,
        });

        registerFire.position = {
            lat: Number(mapsMouseEvent.latLng.toJSON().lat),
            lng: Number(mapsMouseEvent.latLng.toJSON().lng),
        };

        locationIsSelected.value = true;

        infoWindow.value.setContent('Selected fire location');
        infoWindow.value.open(map.value);
    };

    const getAllMarkers = async () => {
        const url = `${import.meta.env.VITE_API_PROJECT}/get`;
        const data: Record<string, string | number> = await axios({
            method: 'get',
            url: url,
        })
            .then((response) => {
                return response.data;
            })
            .catch(console.error);

        if (!data) throw new Error('No data found');

        const numberOfKeys = Object.keys(data).length;

        for (let i = 0; i < numberOfKeys; i++) {
            const value: any = Object.values(data)[i];

            allMarkers.value.push(value);
        }
    };

    const postInApi = async (data: Record<string, string | number>) => {
        const url = `${import.meta.env.VITE_API_PROJECT}/create`;
        const result = await axios
            .post(url, {
                lng: data.lng,
                lat: data.lat,
                reportBy: data.reportBy,
                riskInNeighbourhood: data.riskInNeighbourhood,
                fireSeverity: data.fireSeverity,
                date: data.date,
            })
            .then((response) => {
                console.info('[Save]');
            })
            .catch(console.error);
    };

    const addAllMarkersInMap = async () => {
        await getAllMarkers();

        allMarkers.value.forEach((marker) => {
            createNewMarkerWithInfo(marker);
        });
    };

    const startMap = async (divMap: HTMLElement) => {
        const loader = new Loader({
            apiKey: import.meta.env.VITE_API_GOOGLE_MAPS_KEY,
            version: 'weekly',
        });

        await loader
            .importLibrary('maps')
            .then(async ({ Map, KmlLayer, InfoWindow, StyledMapType }) => {
                map.value = new Map(divMap, mapOptions);

                const nasaDataCanada =
                    'https://firms.modaps.eosdis.nasa.gov/data/active_fire/noaa-20-viirs-c2/kml/J1_VIIRS_C2_Canada_24h.kml';

                geoLayer.value = new KmlLayer({ url: nasaDataCanada });
                geoLayer.value.setMap(map.value);

                infoWindow.value = new InfoWindow();

                await addAllMarkersInMap();

                if (router.currentRoute.value.name === 'ReportFire') {
                    map.value.addListener('click', addNewPoint);
                }
            })
            .catch((e) => {
                console.error('Error:', e);
            });
    };

    const createNewMarkerWithInfo = async (details: Record<string, string | number>) => {
        infoWindow.value.close();

        const currentInfowindow = new google.maps.InfoWindow({
            content: /* html */ `
            <div>
                <p class="text-neutral-500 pb-2">Reported by <b>${details.reportBy}</b></p>
                <p>Risk around: ${details.riskInNeighbourhood}</p>
                <p>Severity: ${details.fireSeverity}</p>
                <p class="text-neutral-500 text-[11px] pt-2">Registered on: ${details.date}</p>
            </div>`,
            ariaLabel: 'Fire details',
        });

        const marker = new google.maps.Marker({
            position: {
                lat: details.lat as number,
                lng: details.lng as number,
            },
            map: map.value,
            title: 'Fire in location',
            icon: iconFire,
        });

        marker.addListener('click', () => {
            currentInfowindow.open({
                anchor: marker,
                map: map.value,
            });
        });
    };

    const showModalSaved = () => {
        const modal = document.getElementById('send_fire_info') as HTMLDialogElement;

        modal.showModal();
    };

    const saveDataOfRegisterFire = async (details: Record<string, string>) => {
        if (!details.reportBy) throw new Error('Report by is required');

        registerFire.riskInNeighbourhood =
            details.riskInNeighbourhood || 'No details reported';
        registerFire.reportBy = details.reportBy;
        registerFire.fireSeverity = details.fireSeverity;

        const currentData = new Date();
        registerFire.date = currentData.toString();

        const newData = {
            reportBy: registerFire.reportBy,
            riskInNeighbourhood: registerFire.riskInNeighbourhood,
            fireSeverity: registerFire.fireSeverity,
            lat: registerFire.position.lat,
            lng: registerFire.position.lng,
            date: registerFire.date,
        };

        await createNewMarkerWithInfo(newData);

        await postInApi(newData);

        showModalSaved();

        registerFire.riskInNeighbourhood = '';
        registerFire.reportBy = '';
        registerFire.fireSeverity = '';
        registerFire.date = '';
        registerFire.position = {
            lat: 0,
            lng: 0,
        };
        router.push({ name: 'home' });
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
