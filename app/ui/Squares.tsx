'use client'
import {Droppable} from './Droppable';
import { FaLink } from "react-icons/fa";
import clsx from 'clsx';

export default function Squares({opponentSelf, setOpponentSelf, castleFen, castleText, blackMoveHighlight, squares} : any ) {
    return (<>
        <div className='flex flex-col items-center'>
        <div className="text-2xl">Chess</div>
        <div className="flex flex-row border-[1px] border-white rounded-md p-1">
            <p className="pr-2">Play against myself</p>
            <input type="checkbox" defaultChecked={opponentSelf} onClick={() => {setOpponentSelf(!opponentSelf)}}/>
        </div>
        <div className='flex flex-row justify-between md:w-[640px] w-[320px]'>
            <div className={clsx('border rounded border-white text-xs px-1 mb-1', {'invisible' : !castleFen.includes('q')})}>{castleText}</div>
            <div className={clsx('border rounded border-white text-xs px-1 mb-1', {'invisible' : !castleFen.includes('k')})}>{castleText}</div>
        </div>
        {[8, 7, 6, 5, 4, 3, 2, 1].map((rank: number, i: number) => {
            return (
                <div key={rank} className='flex flex-row'>
                    {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map((file: string, j: number) => {
                        const n = i + j;
                        return (
                            <div key={file} 
                                className={clsx('md:h-[80px] md:w-[80px] h-[40px] w-[40px] flex flex-row items-center justify-center',
                                    { 'bg-white text-black transition-color duration-1000' : n % 2 === 0 && blackMoveHighlight !== `${file}${rank}`,
                                    'bg-gray-500 text-white transition-color duration-1000' : n % 2 === 1 && blackMoveHighlight !== `${file}${rank}`,
                                    'bg-red-500 transition-color duration-1000 ease-out' : `${file}${rank}` === blackMoveHighlight}
                                )}
                            >
                                <Droppable id={`${file}${rank}`} >
                                    {(() => {
                                        const draggable = Object.keys(squares).find((square) => {
                                            return square === `${file}${rank}`;
                                        })
                                        // [1] is the array storage cell of the draggable being dropped, (i.e., if one is dropped)
                                        // see init variable
                                        return draggable ? squares[`${file}${rank}`][1] : <div className="md:h-[78px] md:w-[78px] h-[38px] w-[38px]"></div>
                                    })()}
                                </Droppable>
                            </div>
                        )
                    })}
                </div>
            )
        })}
        <div className='flex flex-row justify-between md:w-[640px] w-[320px]'>
            <div className={clsx('border rounded border-white text-xs px-1 mt-1', {'invisible' : !castleFen.includes('Q')})}>{castleText}</div>
            <div className={clsx('border rounded border-white text-xs px-1 mt-1', {'invisible' : !castleFen.includes('K')})}>{castleText}</div>
        </div>
        <a href="https://greenchess.net/index.php" className="flex flex-row mt-2">
            <p className="pr-2">Chess piece images by Green Chess</p>
            <FaLink className="mt-1"/>
        </a>
        </div>
    </>)
}