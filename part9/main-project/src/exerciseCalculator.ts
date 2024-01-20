export interface Rating {
   periodLength: number;
   trainingDays: number;
   success: boolean;
   rating: number;
   ratingDescription: string;
   target: number;
   average: number;
}

function getRating(daysHours: number[], target: number): Rating {
   const periodLength = daysHours.length;
   const trainingDays = daysHours.filter((hour) => hour !== 0).length;
   const totalHours = daysHours.reduce((sum, hour) => sum + hour, 0);
   const average = totalHours / periodLength;
   const success = average >= target;

   let rating = 1;
   let ratingDescription = 'could be better';

   if (average >= target) {
      rating = 3;
      ratingDescription = 'excellent';
   } else if (average >= target * 0.75) {
      rating = 2;
      ratingDescription = 'not too bad but could be better';
   }

   const result: Rating = {
      periodLength,
      trainingDays,
      average,
      success,
      rating,
      ratingDescription,
      target,
   };

   return result;
}

export default getRating;
