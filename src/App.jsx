import { useEffect, useState, useCallback } from "react";

const containerStyle = {
  maxWidth: "420px",
  margin: "80px",
  padding: "30px",
  borderRadius: "8px",
  backgroundColor: "#ffffffff",
  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  fontFamily: "Arial, sans-serif",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "12px",
  borderRadius: "4px",
  border: "1px solid #ccc",
};

const primaryButton = {
  width: "100%",
  padding: "10px",
  backgroundColor: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const secondaryButton = {
  width: "100%",
  padding: "10px",
  marginTop: "8px",
  backgroundColor: "#9a9c9eff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};



function App() {
  const [error, setError] = useState("");
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const fetchTasks = useCallback(() => {
    fetch("https://task-backend-vw1t.onrender.com/tasks", {
      headers: {
        Authorization: token,
      },
    })
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Fetch tasks error:", err));
  }, [token]);


    // Fetch tasks when app loads
  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token, fetchTasks]);


  function addTask() {
    if (!task.trim()) return;

    fetch("https://task-backend-vw1t.onrender.com/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ task }),
    })
      .then(() => {
        setTask("");
        fetchTasks(); // ✅ always sync with DB
      })
      .catch((err) => console.error("Add task error:", err));
  }


  if (!token) {
    return (
      <div style={containerStyle}>
        <h2 style={{ textAlign: "center" }}>Task Manager</h2>

        <input
          style={inputStyle}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={inputStyle}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={primaryButton} onClick={login}>
          Login
        </button>

        <button style={secondaryButton} onClick={signup}>
          Create Account
        </button>
      </div>
    );
  }


  function signup() {
    fetch("https://task-backend-vw1t.onrender.com/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then(() => alert("Signup successful! Now login."));
  }

  
  function login() {
    setError("");

    fetch("https://task-backend-vw1t.onrender.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Login failed");
          return;
        }
        localStorage.setItem("token", data.token);
        setToken(data.token);
      });
  }




  return (
    <div style={containerStyle}>
      <h2 style={{ color: "black",}}>My Tasks</h2>

    {error && (
      <p style={{ color: "red", textAlign: "center" }}>{error}</p>
    )}


      <input
        style={inputStyle}
        placeholder="New task"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />

      <button style={primaryButton} onClick={addTask}>
        Add Task
      </button>

      <ul style={{ marginTop: "20px", paddingLeft: "20px", color: "black" }}>
        {tasks.map((t) => (
          <li key={t._id} style={{ marginBottom: "6px" }}>
            {t.task}
          </li>
        ))}
      </ul>

      <button
        style={{ ...secondaryButton, marginTop: "20px" }}
        onClick={() => {
          localStorage.removeItem("token");
          setToken(null);
        }}
      >
        Logout
      </button>
    </div>
  );

}

export default App;
