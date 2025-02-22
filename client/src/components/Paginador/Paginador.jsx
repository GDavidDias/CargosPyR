import { IoIosArrowBack,IoIosArrowForward } from "react-icons/io";

const Paginador = ({currentpage,totalpage,onPageChange,totalItems}) =>{
    const pageNumbers = [];

    const starPage = Math.max(2,currentpage-2);
    const endPage = Math.min(totalpage - 1, currentpage+2);

    if(totalpage>1){
        pageNumbers.push(1); //primer pagina
        if(starPage>2){
            pageNumbers.push("...")
        }
        for(let i = starPage; i<=endPage;i++){
            pageNumbers.push(i);
        }
        if(endPage<totalpage-1){
            pageNumbers.push("...")
        }
        pageNumbers.push(totalpage);
    };

    const getStartItem = (currentpage-1)*10+1;
    const getEndItem = Math.min(currentpage*10, totalItems);

    return(
        <div className="notranslate flex flex-col items-center ">
            <div className="flex flex-row">
                <button
                    disabled={currentpage===1}
                ><IoIosArrowBack 
                    className={`text-xl font-bold desktop-xl:text-lg
                        ${(currentpage===1)
                            ?`text-zinc-300`
                            :`text-zinc-700`
                        }
                        `}
                        onClick={()=>onPageChange(currentpage-1)}
                    /></button>
                {pageNumbers?.map((page,index)=>(
                    <button 
                        key={index} 
                        className={`desktop:px-3 movil:px-2 py-1 rounded-2xl text-base desktop-xl:text-lg
                            ${(currentpage===page)
                                ?`bg-gray-700 text-white`
                                :`bg-gray-100`
                            }
                            ${(page==="..." && "opacity-50 cursor-default")}
                            `}
                        onClick={()=>typeof page==="number" && onPageChange(page)}
                    >{page}</button>
                ))}
                <button
                    disabled={currentpage===totalpage}
                ><IoIosArrowForward 
                    className={`text-xl font-bold desktop-xl:text-lg
                        ${(currentpage===totalpage)
                            ?`text-zinc-300`
                            :`text-zinc-700`
                        }
                        `}
                    onClick={()=>onPageChange(currentpage+1)}
                /></button>
            </div>
            <div>
                <label className="text-sm desktop-xl:text-lg">Mostrando {getStartItem} a {getEndItem} de {totalItems}</label>
            </div>
        </div>
    )
};

export default Paginador;