// import axios from "axios";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";


export default function useSignForm(initalForm) {
    const [form, setForm] = useState(initalForm);
    const [error, setError] = useState({
      name: "",
      pNumber: "",
      cName: "",
      cEmail: "",
      password: "",
      businessNumber: "",
    });

    const validateForm = () => {
      const nextError = {
        name: "",
        pNumber: "",
        cName: "",
        cEmail: "",
        password: "",
        businessNumber: "",
      };

      Object.keys(form).forEach((key) => {
        if (!form[key]?.trim()) {
          nextError[key] = "This field is required.";
        }
      });

      if (form.cEmail.trim() && !isValidEmail(form.cEmail.trim())) {
        nextError.cEmail = "Invalid email format.";
      }

      setError(nextError);
      return !Object.values(nextError).some(Boolean);
    };

  
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();


    const onTabChange = (path) => {
        navigate(path)
    };

    const isValidEmail = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleOnChange = (e) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
      setError((prev) => ({ ...prev, [name]: "" }));

      if (name === "cEmail") {
        const v = value.trim();
        if (!v) return;

        if (!isValidEmail(v)) {
          setError((prev) => ({
            ...prev,
            cEmail: "Invalid email format.",
          }));
        }
      }
    };

    const handleSubmit = async (e, url) => {
      e.preventDefault();

      if (!validateForm()) return;

      setIsLoading(true);

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
      onTabChange,
    };
}
