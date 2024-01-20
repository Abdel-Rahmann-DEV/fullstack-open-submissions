type PersonInformation = {
   readonly height: number;
   readonly weight: number;
};

type BmiResult = PersonInformation & {
   bmi: string;
};

enum BmiCategories {
   SevereThinness = 'Underweight (Severe thinness)',
   ModerateThinness = 'Underweight (Moderate thinness)',
   MildThinness = 'Underweight (Mild thinness)',
   NormalRange = 'Normal range',
   PreObese = 'Overweight (Pre-obese)',
   ClassIObese = 'Obese (Class I)',
   ClassIIObese = 'Obese (Class II)',
   ClassIIIObese = 'Obese (Class III)',
}

const calculateBmi = (person: PersonInformation): number => {
   if (person.height <= 0 || person.weight <= 0) {
      throw new Error('Invalid height or weight values');
   }

   const validHeightSquared: number = person.height ** 2;
   return person.weight / validHeightSquared;
};

const getBmiCategory = (bmi: number): BmiCategories => {
   switch (true) {
      case bmi < 16.0:
         return BmiCategories.SevereThinness;
      case bmi < 17.0:
         return BmiCategories.ModerateThinness;
      case bmi < 18.5:
         return BmiCategories.MildThinness;
      case bmi < 25.0:
         return BmiCategories.NormalRange;
      case bmi < 30.0:
         return BmiCategories.PreObese;
      case bmi < 35.0:
         return BmiCategories.ClassIObese;
      case bmi < 40.0:
         return BmiCategories.ClassIIObese;
      default:
         return BmiCategories.ClassIIIObese;
   }
};

const printPersonBmiCategory = (person: PersonInformation): BmiResult => {
   const bmi: number = calculateBmi(person);
   const resultCategory: BmiResult = { ...person, bmi: getBmiCategory(bmi) };
   return resultCategory;
};

export default printPersonBmiCategory;
