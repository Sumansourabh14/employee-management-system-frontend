import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import ExportToExcelButton from "./utils/exportToExcel";
import { API_URL } from "./utils/config";

function App() {
  const [users, setUsers] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [city, setCity] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/employees`);

      if (response) {
        setUsers(response.data);
      }
    } catch (error) {
      setUsers([]);
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const createEmployee = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/employee`, {
        firstName,
        lastName,
        city,
      });

      if (response) {
        alert("User created", firstName);
        fetchUsers();
      }
    } catch (error) {
      console.error(error);
      alert("Error");
    }
  };

  const updateEmployee = async (id) => {
    try {
      const response = await axios.put(`${API_URL}/api/employee/${id}`, {
        firstName,
        lastName,
        city,
      });

      if (response) {
        alert("User has been updated");
        fetchUsers();
        setIsEditing(false);
        setEditingUserId(null);
        setFirstName("");
        setLastName("");
        setCity("");
      }
    } catch (error) {
      console.error(error);
      alert("Error");
    }
  };

  const deleteEmployee = async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/api/employee/${id}`);

      if (response) {
        alert("User deleted");
        fetchUsers();
      }
    } catch (error) {
      console.error(error);
      alert("Error deleting the employee from the database");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditing && editingUserId) {
      updateEmployee(editingUserId);
    } else {
      createEmployee();
    }
  };

  const handleEdit = (user) => {
    setEditingUserId(user._id);
    setIsEditing(true);
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setCity(user.city);
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setIsEditing(false);
    setFirstName("");
    setLastName("");
    setCity("");
  };

  return (
    <div style={{ maxWidth: "90%", margin: "0 auto" }}>
      <div style={{ position: "absolute", right: 40, top: 40 }}>
        <ExportToExcelButton data={users} fileName={"data"} />
      </div>
      <div style={{ textAlign: "center", marginBottom: "4rem" }}>
        <h1>Employee Management System</h1>
        <p>Using React, Node.js, MongoDB</p>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {!!users ? (
          <table style={{ width: "80%" }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>City</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.city}</td>
                  <td>
                    <button
                      onClick={() => deleteEmployee(user._id)}
                      style={{ padding: "0.4rem", marginRight: "1rem" }}
                    >
                      Remove
                    </button>
                    <button
                      style={{ padding: "0.4rem" }}
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No users</p>
        )}
      </div>
      <div style={{ width: "70%", margin: "0 auto", marginTop: "3rem" }}>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Enter first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            placeholder="Enter last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button type="submit" disabled={!(firstName && lastName && city)}>
            {isEditing ? `Update Employee` : `Create Employee`}
          </button>
          {isEditing && <button onClick={handleCancelEdit}>Cancel</button>}
        </form>
      </div>
      <p style={{ position: "absolute", left: 20, bottom: 20 }}>
        Built by Suman Sourabh
      </p>
    </div>
  );
}

export default App;
