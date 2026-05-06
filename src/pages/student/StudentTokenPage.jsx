import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

export default function StudentTokenPage() {

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [token, setToken] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | VERIFY TOKEN
  |--------------------------------------------------------------------------
  */

  const verifyToken = async () => {

    if (!token) {
      return setError("Token wajib diisi");
    }

    try {

      setLoading(true);

      setError("");

      const res = await api.post(
        "/token/verify",
        {
          token
        }
      );

      /*
      |--------------------------------------------------------------------------
      | SAVE TEMP DATA
      |--------------------------------------------------------------------------
      */

      sessionStorage.setItem(
        "exam_confirmation",
        JSON.stringify({

          token,

          exam: res.data
        })
      );

      /*
      |--------------------------------------------------------------------------
      | REDIRECT
      |--------------------------------------------------------------------------
      */

      navigate("/student/exam-confirmation");

    } catch (err) {

      console.error(err);

      setError(
        err?.response?.data?.error ||
        "Token tidak valid"
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
      verifyToken();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden">

        {/* HEADER */}
        <div className="bg-blue-600 text-white p-6">

          <h1 className="text-2xl font-bold">
            Computer Based Test
          </h1>

          <p className="text-sm opacity-90 mt-1">
            Silakan verifikasi token ujian
          </p>

        </div>

        {/* BODY */}
        <div className="p-6">

          {/* BIODATA */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 border">

            <h2 className="font-semibold text-gray-700 mb-3">
              Biodata Peserta
            </h2>

            <div className="space-y-2 text-sm">

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Nama
                </span>

                <span className="font-medium">
                  {user?.name}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  NIS
                </span>

                <span className="font-medium">
                  {user?.username}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Kelas
                </span>

                <span className="font-medium">
                  {user?.classroom || "-"}
                </span>
              </div>

            </div>

          </div>

          {/* TOKEN */}
          <div className="mb-4">

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Token Ujian
            </label>

            <input
              type="text"
              placeholder="Masukkan token"

              value={token}

              onChange={(e) =>
                setToken(
                  e.target.value
                    .toUpperCase()
                    .slice(0, 6)
                )
              }

              onKeyDown={handleKeyDown}

              className="w-full border rounded-xl p-4 text-center tracking-[10px] text-2xl font-bold uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          {/* ERROR */}
          {error && (

            <div className="bg-red-100 text-red-700 text-sm p-3 rounded-lg mb-4">

              {error}

            </div>
          )}

          {/* BUTTON */}
          <button
            onClick={verifyToken}

            disabled={loading}

            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-4 rounded-xl"
          >
            {loading
              ? "Verifying..."
              : "Verifikasi Token"}
          </button>

        </div>

      </div>

    </div>
  );
}