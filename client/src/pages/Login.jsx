// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../auth/AuthContext";
// import "./Login.css";
// import { useLocation } from "react-router-dom";

// export default function Login() {

//   const { login } = useAuth();
//   const nav = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const location = useLocation();
//   const from = location.state?.from?.pathname || "/profile";

//   async function submit(e) {
//     e.preventDefault();
//     await login(email, password);
//     nav(from, { replace: true });
//   }

//   return (
   
//     <form onSubmit={submit}>
//       <h2>Login</h2>
//       <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
//       <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
//       <button>Login</button>
//     </form>
//   );
// }
