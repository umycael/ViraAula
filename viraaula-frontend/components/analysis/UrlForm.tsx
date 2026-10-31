"use client";
import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { validateYoutubeUrl } from "@/lib/youtube/validateUrl";
interface Props { url:string; setUrl:(v:string)=>void; onSubmit:(v:string)=>void; isLoading:boolean; errorMessage:string|null; setErrorMessage:(v:string|null)=>void; onBackToHome:(e:React.MouseEvent<HTMLAnchorElement>|React.KeyboardEvent<HTMLAnchorElement>)=>void; reduceMotion?:boolean }
export default function UrlForm({url,setUrl,onSubmit,isLoading,errorMessage,setErrorMessage,onBackToHome}:Props){
 const [submitted,setSubmitted]=useState(false); const ref=useRef<HTMLInputElement>(null);
 const change=useCallback((e:React.ChangeEvent<HTMLInputElement>)=>{const value=e.target.value;setUrl(value);if(submitted&&validateYoutubeUrl(value).valid)setErrorMessage(null)},[setUrl,submitted,setErrorMessage]);
 function submit(e:React.FormEvent){e.preventDefault();setSubmitted(true);const result=validateYoutubeUrl(url);if(!result.valid){setErrorMessage(result.error??"Link inválido.");ref.current?.focus();return}setErrorMessage(null);onSubmit(url.trim())}
 return <div className="analysis-intro"><h1>Transforme um vídeo em uma <em>aula que faz sentido.</em></h1><p>Cole o link de uma aula, palestra ou podcast. Em poucos instantes, você recebe um resumo e uma explicação organizada para estudar melhor.</p>
 <form className="url-form" onSubmit={submit}><label htmlFor="youtube-url-input" className="sr-only">Link do vídeo do YouTube</label><div className="url-group"><div className="url-input-wrap"><span className="youtube-icon" aria-hidden="true">▶</span><input ref={ref} id="youtube-url-input" className="url-input" type="url" inputMode="url" autoComplete="off" spellCheck={false} value={url} onChange={change} disabled={isLoading} placeholder="Cole aqui o link do vídeo do YouTube" aria-invalid={Boolean(errorMessage)} aria-describedby={errorMessage?"url-error":undefined}/></div><button className="url-submit" type="submit" disabled={isLoading}>Gerar material <span aria-hidden="true">→</span></button></div>{errorMessage&&<p id="url-error" role="alert" className="form-error">{errorMessage}</p>}</form>
 <p className="form-help"><span aria-hidden="true">✦</span> Funciona melhor com conteúdo falado: aulas, podcasts, palestras e explicações.</p>
 <Link href="/" onClick={onBackToHome} onKeyDown={e=>{if(e.key==="Enter"||e.key===" ")onBackToHome(e)}} className="back-link">← Voltar à tela inicial</Link></div>
}
