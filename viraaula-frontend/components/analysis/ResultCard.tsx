"use client";
import { useState } from "react";
import MarkdownContent from "./MarkdownContent";
import CopyButton from "./CopyButton";
interface Props {title:string;copyLabel:string;content:string;index:string}
export default function ResultCard({title,copyLabel,content,index}:Props){const [error,setError]=useState<string|null>(null);return <section className="result-card"><header className="result-card-header"><h2 className="result-card-title"><span className="result-card-index">{index}</span>{title}</h2><CopyButton label={copyLabel} content={content} onErrorMessage={setError}/></header>{error&&<p role="alert" className="form-error" style={{padding:"0 1.4rem"}}>{error}</p>}<div className="result-body"><MarkdownContent content={content}/></div></section>}
