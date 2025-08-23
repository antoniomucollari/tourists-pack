"use client"
import {useState} from "react";
import styles from './Accordion.module.css';
export default function Accordion({title, description}: AccordionProps){
    const [isOpen, setIsOpen] = useState(false);
    const toggleAccordion = () => {
        setIsOpen(!isOpen); // Sets the state to the opposite of its current value
    };
    return (
            <>
                <div className={`${styles.accordionItem} ${isOpen ? styles.open : ''}`}>
                    <button className={styles.accordionTitle} onClick={toggleAccordion}>
                        <h3>{title}</h3>
                        <span>{isOpen ? '−' : '+'}</span>
                    </button>
                    {isOpen && (
                        <div className={styles.accordionContent}>
                            <p>{description}</p>
                        </div>
                    )}
                </div>

            </>
    )
}

type AccordionProps = {
    title: string;
    description: string;
}