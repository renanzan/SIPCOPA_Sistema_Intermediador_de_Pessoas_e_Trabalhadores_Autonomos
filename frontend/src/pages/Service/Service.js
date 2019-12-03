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
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';

import Footer from '../../components/Footer/Footer';

export default function Service ({ history }) {
    const params = new URLSearchParams(window.location.search);

    const [search, setSearch] = useState(params.get('query') || '');
    const [page, setPage] = useState(params.get('page') || 1);
    const [lowestPrice, setLowestPrice] = useState(params.get('desc') === null);
    
    const [gte, setGte] = useState(0);
    const [lte, setLte] = useState(1000);

    const [onlyLiked, setOnlyLiked] = useState(false);

    const [jobs, setJobs] = useState({});
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(false);

    useEffect(() => {
        setLoading(true);

        api.post(`/service?page=${page}`, {
            filter: {
                $and:[{
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
                        $gte: gte,
                        $lte: lte
                    }
                }]
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
    }, [page, reload, lowestPrice, gte, lte]);

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
            
            <SearchContainer history={history} currentPage={page} setGte={setGte} setLte={setLte} search={search} setSearch={setSearch} jobs={jobs} reload={reload} setReload={setReload} />
            <div className="list-container">
                <Filter loading={loading} jobs={jobs} setGte={setGte} setLte={setLte} onlyLiked={onlyLiked} setOnlyLiked={setOnlyLiked} lowestPrice={lowestPrice} setLowestPrice={setLowestPrice} />
                {
                    loading ? (() => {
                        if((Math.floor(Math.random()*3) + 1) === 1)
                            return(<LottieControl animationData={AnimationData1} height="400" style={styles.loadingContainer} />);
                        if((Math.floor(Math.random()*3) + 1) === 2)
                            return(<LottieControl animationData={AnimationData2} height="400" style={styles.loadingContainer} />);
                        else
                            return(<LottieControl animationData={AnimationData3} height="400" style={styles.loadingContainer} />);
                        })() :
                    <List onlyLiked={onlyLiked} jobs={jobs} history={history} />
                }
            </div>
            {/* <Footer /> */}
        </div>
    );
}

const SearchContainer = ({ history, search, setSearch, jobs, setGte, setLte, reload, setReload }) => {
    return(
        <div className='search-container'>
            <InputText value='Buscar' placeholder='Filtrar resultados' useState={search} setState={setSearch} style={{ width:'30%' }} onPressEnter={() => { setGte(0); setLte(1000); history.push(`/service?query=${search}&page=${Number.parseInt(1)}`); setReload(!reload); }} />
            <label className="results">{jobs.results} trabalhos encontrados</label>
        </div>
    );
}

const Filter = ({ loading, jobs, setGte, setLte, onlyLiked, setOnlyLiked, lowestPrice, setLowestPrice }) => {
    var maxPrice, minPrice;
    const [value, setValue] = React.useState([]);

    if(jobs.extremes) {
        minPrice = jobs.extremes.price[0];
        maxPrice = jobs.extremes.price[1];
    }

    useEffect(() => {
        const newValue = [minPrice, maxPrice];
        setValue(newValue);
    }, [minPrice, maxPrice]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleSearch = (event) => {
        setGte(value[0]);
        setLte(value[1]);
    }

    function valuetext(value) {
        return `${value} points`;
    }

    const marks = [
        {
          value: minPrice,
          label: `${minPrice} Ɏ`,
        },
        {
            value: ((minPrice + maxPrice) /2),
            label: `${((minPrice + maxPrice) /2)} Ɏ`,
          },
        {
          value: maxPrice,
          label: `${maxPrice} Ɏ`,
        }
    ];

    return(
        <div className="left-container">
            <OrderBy style={{ marginBottom: '25px' }} lowestPrice={lowestPrice} setLowestPrice={setLowestPrice} />
            
            <div className="filter-container">
                <div className="filter-content">
                    <label className="title">Filtros</label>

                    <FormControlLabel
                        control={
                            <Switch checked={onlyLiked} onChange={e => {setOnlyLiked(!onlyLiked)}} value="jason" />
                        }
                        label="Apenas favoritos" />

                    <div style={{ marginTop:'20px', height:'200px', width:'200px' }}>
                        <Typography id="discrete-slider" gutterBottom>Intervalo de preço</Typography>
                        {
                            (loading) ?
                                (!maxPrice || !minPrice) ? null :
                                    <Slider
                                        // orientation="vertical"
                                        value={value}
                                        valueLabelDisplay="auto"
                                        aria-labelledby="range-slider"
                                        aria-labelledby="vertical-slider"
                                        getAriaValueText={valuetext}
                                        min={minPrice || 0}
                                        max={maxPrice || 50}
                                        marks={marks}
                                        disabled />
                            :
                                <Slider
                                    // orientation="vertical"
                                    value={value}
                                    onChange={handleChange}
                                    onMouseUp={handleSearch}
                                    valueLabelDisplay="auto"
                                    aria-labelledby="range-slider"
                                    aria-labelledby="vertical-slider"
                                    getAriaValueText={valuetext}
                                    min={minPrice || 0}
                                    max={maxPrice || 50}
                                    marks={marks} />
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

const List = ({ history, jobs, onlyLiked }) => {
    return(
        <div style={styles.list}>
            {
                (jobs.jobs.length > 0) ?
                    jobs.jobs ? 
                        jobs.jobs.map((element, index) => {
                            return(
                                <JobCard key={index} job={element} history={history} onlyLiked={onlyLiked} />
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