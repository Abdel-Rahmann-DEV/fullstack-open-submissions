import { CoursePart } from '../App';

const assertNever = (value: never): never => {
   throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};
const Part = ({ part }: { part: CoursePart }) => {
   switch (part.kind) {
      case 'basic':
         return (
            <div>
               <h2>{part.name}</h2>
               <p>Exercise Count: {part.exerciseCount}</p>
               <p>Description: {part.description}</p>
            </div>
         );
      case 'background':
         return (
            <div>
               <h2>{part.name}</h2>
               <p>Exercise Count: {part.exerciseCount}</p>
               <p>Description: {part.description}</p>
               <a href={part.backgroundMaterial}>backgroundMaterial</a>
            </div>
         );
      case 'group':
         return (
            <div>
               <h2>{part.name}</h2>
               <p>Exercise Count: {part.exerciseCount}</p>
               <p>Group Project Count: {part.groupProjectCount}</p>
            </div>
         );
      case 'special':
         return (
            <div>
               <h2>{part.name}</h2>
               <p>Exercise Count: {part.exerciseCount}</p>
               <p>
                  Required skils:{' '}
                  {part.requirements.map((e) => (
                     <span key={e}>{e} </span>
                  ))}
               </p>
            </div>
         );
      default:
         return assertNever(part);
   }
};

export default Part;
