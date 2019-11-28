import React, { useState, useEffect } from 'react';

import api from '../../services/api';

import './service.css';
import { InputText, OrderBy } from '../../components/custom/Input';
import JobCard from '../../components/custom/JobCard/JobCard';

import AnimationData1 from '../../assets/animations/lottie.json/jobs/fresh-new-job.json';
import AnimationData2 from '../../assets/animations/lottie.json/jobs/looking-for-jobs.json';
import AnimationData3 from '../../assets/animations/lottie.json/jobs/looking-for-jobs-2.json';
import LottieControl from '../../assets/animations/LottieControl';

import Slider from '@material-ui/core/Slider';

import Footer from '../../components/Footer/Footer';

export default function Service ({ history }) {
    const params = new URLSearchParams(window.location.search);

    const [search, setSearch] = useState(params.get('query') || '');
    const [page, setPage] = useState(params.get('page') || 1);
    const [lowestPrice, setLowestPrice] = useState(params.get('desc') === null);

    const [jobs, setJobs] = useState({});
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(false);

    useEffect(() => {
        setLoading(true);

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
            setJobs(response.data);
            setLoading(false);
        });
    }, [page, reload, lowestPrice]);

    function handleChangePage(e) {
        (e === 'NEXT') ? (() => {
            if(page>=jobs.pages)
                return;

            if(!jobs.pages) {
                setPage(1);
                history.push('/service?query=&page=1');
                return;
            }

            setPage(Number.parseInt(page) + 1);
            history.push(`/service?query=${search}&page=${Number.parseInt(page) + 1}`);
        })() : (() => {
            if(page<=1) {
                if(page<1) {
                    setPage(1);
                    history.push('/service?page=1');
                }
                return;
            }

            setPage(Number.parseInt(page) - 1);
            history.push(`/service?query=${search}&page=${Number.parseInt(page) - 1}`);
        })()
    }

    return(
        <div className='main-container'>
            {/* <button onClick={ e => handleChangePage('NEXT') }>NEXT</button>
            <button onClick={ e => handleChangePage() }>PREV</button> */}
            
            <SearchContainer history={history} currentPage={page} search={search} setSearch={setSearch} jobs={jobs} reload={reload} setReload={setReload} />
            <div className="list-container">
                <Filter lowestPrice={lowestPrice} setLowestPrice={setLowestPrice} />
                {
                    loading ? (() => {
                        if((Math.floor(Math.random()*3) + 1) === 1)
                            return(<LottieControl animationData={AnimationData1} height="400" style={styles.loadingContainer} />);
                        if((Math.floor(Math.random()*3) + 1) === 2)
                            return(<LottieControl animationData={AnimationData2} height="400" style={styles.loadingContainer} />);
                        else
                            return(<LottieControl animationData={AnimationData3} height="400" style={styles.loadingContainer} />);
                        })() :
                    <List jobs={jobs} history={history} />
                }
            </div>
            {/* <Footer /> */}
        </div>
    );
}

const SearchContainer = ({ history, search, setSearch, jobs, reload, setReload }) => {
    return(
        <div className='search-container'>
            <InputText value='Buscar' placeholder='Filtrar resultados' useState={search} setState={setSearch} style={{ width:'30%' }} onPressEnter={() => { history.push(`/service?query=${search}&page=${Number.parseInt(1)}`); setReload(!reload); }} />
            <label className="results">{jobs.results} trabalhos encontrados</label>
        </div>
    );
}

const Filter = ({ lowestPrice, setLowestPrice }) => {
    const [value, setValue] = React.useState([0, 37]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    function valuetext(value) {
        return `${value} points`;
    }

    const marks = [
        {
          value: 0,
          label: '0 Ɏ',
        },
        {
          value: 25,
          label: '25 Ɏ',
        },
        {
          value: 50,
          label: '50 Ɏ',
        }
      ];

    return(
        <div className="left-container">
            <OrderBy style={{ marginBottom: '25px' }} lowestPrice={lowestPrice} setLowestPrice={setLowestPrice} />
            <div className="filter-container">
                <div className="filter-content">
                    <label className="title">Filtros</label>

                    <label>Intervalo de preço</label>
                    {/* <Slider
                        orientation="vertical"
                        value={value}
                        onChange={handleChange}
                        valueLabelDisplay="auto"
                        aria-labelledby="range-slider"
                        aria-labelledby="vertical-slider"
                        getAriaValueText={valuetext}
                        max="50"
                        marks={marks} /> */}
                </div>
            </div>
        </div>
    );
}

const List = ({ history, jobs }) => {
    return(
        <div style={styles.list}>
            {
                (jobs.jobs.length > 0) ?
                    jobs.jobs ? 
                        jobs.jobs.map((element, index) => {
                            return(
                                <JobCard key={index} job={element} history={history} />
                            );
                        })
                    : null
                : <div>Nenhum resultado encontrado..</div>
            }
        </div>
    );
}

const styles = {
    list: {
        flex: 1,
        alignSelf: 'flex-start',
        display: 'flex',
        flexWrap: 'wrap'
    },
    loadingContainer: {
        width: '100%',
        marginTop: '100px'
    }
}