import { useState, useEffect } from "react";
import personsService from "./services/persons";
const Filter = ({ filter, setFilter }) => {
   return (
      <div>
         Filter shown with <input type="text" value={filter} onChange={(e) => setFilter(e.target.value)} />
      </div>
   );
};
const PersonForm = ({ handleSubmit, newName, setNewName, newNumber, setNewNumber }) => {
   return (
      <form onSubmit={handleSubmit}>
         <div>
            Name: <input value={newName} onChange={(e) => setNewName(e.target.value)} />
            <div>
               Number: <input value={newNumber} onChange={(e) => setNewNumber(e.target.value)} />
            </div>
         </div>
         <div>
            <button type="submit">Add</button>
         </div>
      </form>
   );
};
const Persons = ({ persons, handleDelete }) => {
   return (
      <>
         {persons.map((person) => (
            <p key={person.id}>
               {person.name} {person.number} <button onClick={() => handleDelete(person.id, person.name)}>delete</button>
            </p>
         ))}
      </>
   );
};
const Notification = ({ data }) => {
   if (data === null) {
      return null;
   }

   return <div className={data.type}>{data.message}</div>;
};
const App = () => {
   const [persons, setPersons] = useState([]);
   const [newName, setNewName] = useState("");
   const [newNumber, setNewNumber] = useState("");
   const [filter, setFilter] = useState("");
   const [notification, setNotification] = useState(null);
   useEffect(() => {
      personsService.getAll().then((response) => {
         setPersons(response.data);
      });
   }, []);
   const handleAddNew = (e) => {
      e.preventDefault();

      const existingPerson = persons.find((person) => person.name === newName);

      if (existingPerson) {
         if (existingPerson.number === newNumber) {
            alert(`${newName} is already added to the phonebook`);
         } else {
            if (window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {
               updatePersonNumber(existingPerson.id, newNumber);
            }
         }
      } else {
         createNewPerson();
      }
   };

   const updatePersonNumber = (id, newNumber) => {
      personsService
         .update(id, { number: newNumber })
         .then((response) => {
            setPersons((currentPersons) => currentPersons.map((person) => (person.id === id ? { ...person, number: newNumber } : person)));
            setNotification({ type: "success", message: `Number of ${newName} is updated to ${newNumber}` });
         })
         .catch((error) => {
            setNotification({ type: "error", message: `information of ${newName} has already been removed from server` });
            setPersons(persons.filter((p) => p.id !== id));
         })
         .finally(() => {
            clearNotificationAfterDelay();
         });
   };

   const createNewPerson = () => {
      const newPerson = { name: newName, number: newNumber };
      personsService.create(newPerson).then((response) => {
         setPersons((currentPersons) => [...currentPersons, response.data]);
         setNotification({ type: "success", message: `Added ${newName}` });
         clearNotificationAfterDelay();
      });
   };
   const clearNotificationAfterDelay = () => {
      setTimeout(() => {
         setNotification(null);
      }, 3000);
   };

   const handleDelete = (id, name) => {
      if (window.confirm(`Delete ${name} ?`)) {
         personsService
            .deletePerson(id)
            .then(() => {
               setPersons(persons.filter((e) => e.id !== id));
            })
            .catch((error) => console.log(error));
      }
   };

   const filteredPersons = filter ? persons.filter((person) => person.name.includes(filter)) : persons;

   return (
      <div>
         <h2>Phonebook</h2>
         <Notification data={notification} />
         <Filter filter={filter} setFilter={setFilter} />
         <h2>Add a new</h2>
         <PersonForm handleSubmit={handleAddNew} newName={newName} setNewName={setNewName} newNumber={newNumber} setNewNumber={setNewNumber} />
         <h2>Numbers</h2>
         <Persons persons={filteredPersons} handleDelete={handleDelete} />
      </div>
   );
};

export default App;
