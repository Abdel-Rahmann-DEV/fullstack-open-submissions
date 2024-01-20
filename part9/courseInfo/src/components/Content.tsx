import { CoursePart } from '../App';
import Part from './Part';
const Content = ({ parts }: { parts: CoursePart[] }) => {
   return (
      <div>
         {parts.map((e: CoursePart, i: number) => (
            <Part key={i} part={e} />
         ))}
      </div>
   );
};

export default Content;
