"use client";

import { useState } from "react";
import { getFullApiUrl } from "@/services";
import { AdmissionFormData, INITIAL_FORM_DATA, FormChangeHandler } from "./types";

export function useAdmissionForm() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState<AdmissionFormData>(() => ({
    ...INITIAL_FORM_DATA,
    khaoSatDauVao: {
      phys_balance_walk: 1.0,
      phys_hold_pencil: 1.0,
      phys_self_clean: 1.0,
      phys_toilet_dress: 1.0,
      phys_small_objects: 1.0,
      phys_stamina_active: 1.0,
      cog_curiosity_env: 1.0,
      cog_classify_objects: 1.0,
      cog_solve_problems: 1.0,
      cog_count_20: 1.0,
      cog_association: 1.0,
      cog_count_10: 1.0,
      cog_geometry_shape: 1.0,
      cog_compare_numbers: 1.0,
      lang_communicate_clear: 1.0,
      lang_follow_commands: 1.0,
      lang_listen_classroom: 1.0,
      lang_appropriate_words: 1.0,
      lang_tell_story: 1.0,
      lang_rhyme_poetry: 1.0,
      lang_voice_control: 1.0,
      lang_clear_pronounce: 1.0,
      lang_book_interest: 1.0,
      lang_write_name: 1.0,
      soc_finish_task_ontime: 1.0,
      soc_tidy_toys: 1.0,
      soc_emotion_stability: 1.0,
      soc_obey_rules: 1.0,
      soc_wait_turn: 1.0,
      aes_draw_creative: 1.0,
      aes_special_talent: 1.0,
    },
  }));

  const handleChange: FormChangeHandler = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSurveyChange = (key: string, value: number) => {
    setForm((prev) => ({
      ...prev,
      khaoSatDauVao: {
        ...(prev.khaoSatDauVao || {}),
        [key]: value,
      },
    }));
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
    handleSurveyChange,
    handleSubmit,
    resetForm,
  };
}
