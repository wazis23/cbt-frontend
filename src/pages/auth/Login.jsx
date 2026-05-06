import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/api";
import { setAuth } from "../../utils/auth";

export default function Login() {

  const navigate = useNavigate();

  /*
  |--------------------------------------------------------------------------
  | FORM
  |--------------------------------------------------------------------------
  */

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | LOGIN MODE
  |--------------------------------------------------------------------------
  */

  const [loginType, setLoginType] = useState("student");

  /*
  |--------------------------------------------------------------------------
  | SCHOOL BRANDING
  |--------------------------------------------------------------------------
  */

  const [school, setSchool] = useState({

    name: "SMK Tinta Emas Indonesia",

    logo:
      "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",

    primary_color: "#2563eb",

    secondary_color: "#1e40af"
  });

  /*
  |--------------------------------------------------------------------------
  | LOAD SETTING
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    loadSetting();

  }, []);

  const loadSetting = async () => {

    try {

      const res = await api.get("/settings/public");

      if (res.data) {

        setSchool({

          name:
            res.data.school_name ||
            "SMK Tinta Emas Indonesia",

          logo:
            res.data.school_logo ||
            "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",

          primary_color:
            res.data.primary_color ||
            "#2563eb",

          secondary_color:
            res.data.secondary_color ||
            "#1e40af"
        });
      }

    } catch (err) {

      console.log("Using default school setting");
    }
  };

  /*
  |--------------------------------------------------------------------------
  | LOGIN
  |--------------------------------------------------------------------------
  */

  const login = async () => {

    try {

      setLoading(true);

      setError("");

      /*
      |--------------------------------------------------------------------------
      | VALIDASI LOGIN TYPE
      |--------------------------------------------------------------------------
      */

      // ADMIN → bebas username
      if (loginType !== "admin") {

        // selain admin wajib angka
        if (!/^[0-9]+$/.test(username)) {

          setLoading(false);

          return setError(

            loginType === "student"
              ? "NIS harus berupa angka"
              : "ID harus berupa angka"
          );
        }
      }

      /*
      |--------------------------------------------------------------------------
      | REQUEST LOGIN
      |--------------------------------------------------------------------------
      */

      const res = await api.post(
        "/auth/login",
        {
          username,
          password
        }
      );

      const user = res.data.user;

      /*
      |--------------------------------------------------------------------------
      | SAVE AUTH
      |--------------------------------------------------------------------------
      */

      setAuth(
        res.data.token,
        user.role
      );

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      /*
      |--------------------------------------------------------------------------
      | REDIRECT
      |--------------------------------------------------------------------------
      */

      if (loginType === "student") {

        navigate("/student/token");

      } else if (loginType === "guru") {

        navigate("/guru");

      } else if (loginType === "proctor") {

        navigate("/proctor");

      } else if (loginType === "admin") {

        navigate("/admin");

      } else {

        navigate("/");
      }

    } catch (err) {

      console.error(err);

      setError(
        err?.response?.data?.message ||
        "Username atau password salah"
      );

    } finally {

      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | ENTER SUBMIT
  |--------------------------------------------------------------------------
  */

  const handleKeyDown = (e) => {

    if (e.key === "Enter") {
      login();
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 bg-cover bg-center relative overflow-hidden"
      style={{
        backgroundImage:
          `linear-gradient(
            135deg,
            ${school.primary_color}dd,
            ${school.secondary_color}ee
          ),
          url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1974&auto=format&fit=crop')`
      }}
    >

      {/* OVERLAY */}
      <div className="absolute inset-0 backdrop-blur-[2px]" />

      {/* CARD */}
      <div className="relative z-10 bg-white/95 backdrop-blur-xl w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-white/20">

        {/* HEADER */}
        <div
          className="p-8 text-white text-center"
          style={{
            background:
              `linear-gradient(
                135deg,
                ${school.primary_color},
                ${school.secondary_color}
              )`
          }}
        >

          {/* LOGO */}
          <div className="flex justify-center mb-4">

            <div className="bg-white p-4 rounded-2xl shadow-lg">

              <img
                src={school.logo}
                alt="logo"
                className="w-20 h-20 object-contain"
              />

            </div>

          </div>

          {/* TITLE */}
          <h1 className="text-2xl font-bold leading-tight">
            {school.name}
          </h1>

          <p className="mt-2 text-sm opacity-90">
            Computer Based Test System
          </p>

        </div>

        {/* BODY */}
        <div className="p-8">

          {/* TITLE */}
          <div className="mb-6 text-center">

            <h2 className="text-2xl font-bold text-gray-800">
              Welcome Back
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Silakan login untuk melanjutkan
            </p>

          </div>

          {/* LOGIN MODE */}
          <div className="grid grid-cols-2 gap-3 mb-5">

            <button
              onClick={() => setLoginType("student")}
              className={`p-3 rounded-xl border transition font-medium ${
                loginType === "student"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700"
              }`}
            >
              Siswa
            </button>

            <button
              onClick={() => setLoginType("guru")}
              className={`p-3 rounded-xl border transition font-medium ${
                loginType === "guru"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700"
              }`}
            >
              Guru
            </button>

            <button
              onClick={() => setLoginType("proctor")}
              className={`p-3 rounded-xl border transition font-medium ${
                loginType === "proctor"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700"
              }`}
            >
              Proktor
            </button>

            <button
              onClick={() => setLoginType("admin")}
              className={`p-3 rounded-xl border transition font-medium ${
                loginType === "admin"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700"
              }`}
            >
              Admin
            </button>

          </div>

          {/* ERROR */}
          {error && (
            <div className="bg-red-100 border border-red-200 text-red-700 text-sm p-3 rounded-xl mb-5">
              {error}
            </div>
          )}

          {/* USERNAME */}
          <div className="mb-4">

            <label className="block text-sm font-medium text-gray-700 mb-2">

              {
                loginType === "admin"
                  ? "Username Admin"
                  : loginType === "student"
                    ? "NIS"
                    : "ID"
              }

            </label>

            <input
              type="text"

              placeholder={
                loginType === "admin"
                  ? "Masukkan username admin"
                  : loginType === "student"
                    ? "Masukkan NIS"
                    : "Masukkan ID"
              }

              value={username}

              onChange={(e) =>
                setUsername(e.target.value)
              }

              onKeyDown={handleKeyDown}

              className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition rounded-xl p-4 outline-none"
            />

          </div>

          {/* PASSWORD */}
          <div className="mb-6">

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>

            <input
              type="password"

              placeholder="Masukkan password"

              value={password}

              onChange={(e) =>
                setPassword(e.target.value)
              }

              onKeyDown={handleKeyDown}

              className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition rounded-xl p-4 outline-none"
            />

          </div>

          {/* BUTTON */}
          <button
            onClick={login}

            disabled={loading}

            className="w-full text-white py-4 rounded-xl font-semibold transition hover:opacity-90 shadow-lg"

            style={{
              background:
                `linear-gradient(
                  135deg,
                  ${school.primary_color},
                  ${school.secondary_color}
                )`
            }}
          >
            {
              loading
                ? "Signing In..."
                : "Login"
            }
          </button>

          {/* FOOTER */}
          <div className="mt-6 text-center text-xs text-gray-400">

            CBT System © {new Date().getFullYear()}

          </div>

        </div>

      </div>

    </div>
  );
}