const Header = ({ courseName }) => {
   return <h2>{courseName}</h2>;
};

const Content = ({ parts }) => {
   return (
      <div>
         {parts.map((part) => (
            <Part part={part} key={part.id} />
         ))}
      </div>
   );
};
const Part = ({ part }) => {
   return (
      <div>
         <p>
            {part.name} {part.exercises}
         </p>
      </div>
   );
};

const Total = ({ parts }) => {
   let total = parts.reduce((acc, curr) => (acc += curr.exercises), 0);
   return (
      <div>
         <h3>total of {total} exercises</h3>
      </div>
   );
};

const Course = ({ course }) => {
   return (
      <>
         <Header courseName={course.name} />
         <Content parts={course.parts} />
         <Total parts={course.parts} />
      </>
   );
};
export default Course;
