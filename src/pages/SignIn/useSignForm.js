import axios from "axios";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";


export default function useSignForm(initalForm) {
    const [form, setForm] = useState(initalForm);

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const onTabChange = (e) => {
        useNavigate(e)
    }

    const handleOnChange = (e) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
      setError("");
    };

    const handleSubmit = async (e, url) => {
      e.preventDefault();

      setIsLoading(true);
      setError("");

      try {
        const response = await axios.post(url, form); // form으로 통일
        if (response.status === 200 || response.status === 201) {
          alert("signup successful");
        }
      } catch (error) {
        console.error(
          "failed to sign up",
          error.response?.data?.message || error.message
        );
        alert("signup failed");
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    return {
      form,
      setForm,
      error,
      isLoading,
      handleOnChange,
      handleSubmit,
    };
}