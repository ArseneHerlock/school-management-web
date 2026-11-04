"use client";

import { useState } from "react";
import { getFullApiUrl } from "@/services";
import { AdmissionFormData, INITIAL_FORM_DATA, FormChangeHandler } from "./types";

export function useAdmissionForm() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState<AdmissionFormData>(INITIAL_FORM_DATA);

  const handleChange: FormChangeHandler = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setSubmitted(false);
    setForm(INITIAL_FORM_DATA);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!form.tenTre.trim()) {
      setErrorMsg("Vui lòng nhập họ và tên của trẻ.");
      return;
    }
    if (!form.dienThoaiLienHe && !form.dienThoaiMe && !form.dienThoaiCha) {
      setErrorMsg("Vui lòng nhập ít nhất một số điện thoại liên lạc.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(getFullApiUrl("/api/enrollment"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || "Gửi đơn đăng ký thất bại.");
      }

      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Lỗi khi gửi đơn đăng ký.");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    form,
    submitting,
    submitted,
    errorMsg,
    handleChange,
    handleSubmit,
    resetForm,
  };
}
