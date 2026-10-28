"use client";

import NewsTab from "../components/NewsTab";
import { useParentContext } from "../ParentContext";

export default function NewsPage() {
  const { news } = useParentContext();
  return <NewsTab newsList={news} />;
}
