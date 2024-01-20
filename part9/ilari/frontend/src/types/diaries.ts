export enum Weather {
   Sunny = 'sunny',
   Rainy = 'rainy',
   Cloudy = 'cloudy',
   Stormy = 'stormy',
   Windy = 'windy',
}
export enum Visibility {
   Great = 'great',
   Good = 'good',
   Ok = 'ok',
   Poor = 'poor',
}

export interface Diaries {
   id: string;
   date: string;
   weather: Weather;
   visibility: Visibility;
   comment: string;
}
export interface NewDiarie {
   date: string;
   weather: Weather;
   visibility: Visibility;
   comment: string;
}
export interface SensitiveDiary {
   comment: string;
}
