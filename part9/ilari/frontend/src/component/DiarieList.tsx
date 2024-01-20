import { Diaries } from '../types/diaries';
import Diarie from './Diarie';

const DiarieList = ({ diaries }: { diaries: Diaries[] }) => {
   return (
      <div >
         {diaries.map((e, i: number) => (
            <Diarie key={i} diarie={e} />
         ))}
      </div>
   );
};

export default DiarieList;
