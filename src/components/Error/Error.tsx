import css from './Error.module.css'
import { MdOutlineReportGmailerrorred } from "react-icons/md";
export interface ErrorProps {
    message: string
}

const Error = ({ message }: ErrorProps) => {
    return (
        <div className={css.row}>
            <MdOutlineReportGmailerrorred className={css.icon} size={30} />
            <p className={css.text}>There was an {message}, please try again...</p>
        </div>
    );
};


export default Error;