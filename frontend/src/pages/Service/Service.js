import React, { useState, useEffect } from 'react';

import api from '../../services/api';

import './service.css';
import { InputText, OrderBy } from '../../components/custom/Input';
import JobCard from '../../components/custom/JobCard';

export default function Service (props) {
    const [search, setSearch] = useState('');
    const [lowestPrice, setLowestPrice] = useState(true);

    const [jobs, setJobs] = useState({});
    const [page, setPage] = useState(1);

    const [reload, setReload] = useState(false);

    useEffect(() => {
        api.post(`/service?page=${page}`, {
            filter: {
                $or: [{
                    job: {
                        $regex: search
                    }
                    }, {
                        description: {
                            $regex: search
                        }
                    }
                ],
                price: {
                    $gte: 0,
                    $lte: 1000
                }
            },
            sort_by: {
                price: lowestPrice ? "asc" : "desc"
            }
        }, {
            headers: {
                perpage: 15
            }
        }).then((response) => {
            console.log(response.data);
            setJobs(response.data);
        });
    }, [page, reload, lowestPrice]);

    return(
        <div className='main-container'>
            {/* <button onClick={(e) => { setPage(page + 1) }}>NEXT</button>
            <button onClick={(e) => { setPage(page - 1) }}>PREV</button> */}
            
            <SearchContainer search={search} setSearch={setSearch} jobs={jobs} reload={reload} setReload={setReload} />
            <div className="list-container">
                <Filter lowestPrice={lowestPrice} setLowestPrice={setLowestPrice} />
                <List jobs={jobs} />
            </div>
            <Footer />
        </div>
    );
}

const SearchContainer = ({ search, setSearch, jobs, reload, setReload }) => {
    return(
        <div className='search-container'>
            <InputText value='Buscar' placeholder='Filtrar resultados' useState={search} setState={setSearch} style={{ width:'30%' }} onPressEnter={() => { setReload(!reload) }} />
            <label className="results">{jobs.results} trabalhos encontrados</label>
        </div>
    );
}

const Filter = ({ lowestPrice, setLowestPrice }) => {
    return(
        <div className="left-container">
            <OrderBy style={{ marginBottom: '25px' }} lowestPrice={lowestPrice} setLowestPrice={setLowestPrice} />
            <div className="filter-container">
                <div className="filter-content">
                    <label className="title">Filtros</label>
                </div>
            </div>
        </div>
    );
}

const List = ({ jobs }) => {
    return(
        <div style={styles.list}>
            {
                jobs.jobs ? 
                    jobs.jobs.map((element, index) => {
                        return(
                            <JobCard job={element}/>
                        );
                    })
                : null
            }
        </div>
    );
}

const Footer = () => {
    return(
        <div className="footer">FOOTER</div>
    );
}

const styles = {
    list: {
        flex: 1,
        alignSelf: 'flex-start',
        display: 'flex',
        margin: '50px 3% 0 0',
        flexWrap: 'wrap'
    }
}