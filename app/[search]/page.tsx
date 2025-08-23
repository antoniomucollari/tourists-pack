
export default function SearchString({ params }: UserPageProps){
    function decodeSearchParam(param: string): string {
        return param.replace(/%20/g, " "); // replaces "%20" with space
    }
    return(<>{decodeSearchParam(params.search)}</>)
}

interface UserPageProps {
    params: {
        search: string;
    };
}