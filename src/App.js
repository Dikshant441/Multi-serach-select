import { useEffect, useRef, useState } from "react";
import Pills from "./Pills";
function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestion] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUserSet, setSelectedUserSet] = useState(new Set());

  const Input = useRef(null);
  // https://dummyjson.com/users/search?q=John

  useEffect(() => {
    const fetchUsers = () => {
      if (searchTerm.trim() === "") {
        setSuggestion([]);
        return;
      }

      fetch(`https://dummyjson.com/users/search?q=${searchTerm}`)
        .then((res) => res.json())
        .then((data) => setSuggestion(data))
        .catch((err) => {
          console.error(err);
        });
    };
    fetchUsers();
  }, [searchTerm]);

  const handleSelectUser = (user) => {
    setSelectedUsers([...selectedUsers, user]);
    setSelectedUserSet(new Set([...selectedUserSet, user.email]));
    setSearchTerm("");
    setSuggestion([]);
    Input.current.focus();
  };

  console.log(selectedUsers);

  const handleRemoveUser = (user) => {
    const updatedUser = selectedUsers.filter(
      (selectedUser) => selectedUser.id !== user.id
    );
    setSelectedUsers(updatedUser);

    const updatedEmail = new Set(selectedUserSet);
    updatedEmail.delete(user.email);
    setSelectedUserSet(updatedEmail);
  };


  const handleKeyDown = (e) => {
    if (
      e.key === 'BackSpace' &&
      e.target.value === "" &&
      selectedUsers.length > 0
    ) {
      const lastUser = selectedUsers[selectedUsers.length - 1];
      handleRemoveUser(lastUser);
      setSuggestion([]);
    }
  };

  return (
    <div className="flex relative">
      <div className="w-full flex items-center flex-wrap gap-8 p-3 m-3 border border-black rounded-full">
        {/* PIlls  */}
        {selectedUsers.map((user) => {
          return (
            <Pills
              key={user.email}
              image={user.image}
              text={`${user.firstName} ${user.lastName}`}
              onClick={() => handleRemoveUser(user)}
            />
          );
        })}

        {/* input  fied with search suggestions */}
        <div className="">
          <input
            className="border-none h-8 p-2 w-full focus:outline-none"
            ref={Input}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a user..."
            onKeyDown={handleKeyDown}
          />
          {/* search suggestoion */}
          <ul className="absolute max-h-[400px] overflow-y-scroll list-none bg-white border-1 border-solid border-black">
            {suggestions?.users?.map((user, index) => {
              return !selectedUserSet.has(user.email) ? (
                <li
                  onClick={() => handleSelectUser(user)}
                  className=" flex items-center border-b border-black last:border-none hover:bg-gray-400"
                  key={user.email}
                >
                  <img
                    className="h-[20px]"
                    src={user.image}
                    alt={`${user.firstName} ${user.lastName}`}
                  />{" "}
                  <span className="p-2">
                    {user.firstName} {user.lastName}
                  </span>
                </li>
              ) : (
                <></>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
