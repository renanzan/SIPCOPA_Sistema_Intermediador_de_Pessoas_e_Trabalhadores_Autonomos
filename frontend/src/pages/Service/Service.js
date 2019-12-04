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
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Typography from '@material-ui/core/Typography';

import Footer from '../../components/Footer/Footer';

export default function Service ({ history }) {
    const params = new URLSearchParams(window.location.search);

    const [search, setSearch] = useState(params.get('query') || '');
    const [page, setPage] = useState(params.get('page') || 1);
    const [lowestPrice, setLowestPrice] = useState(params.get('desc') === null);
    
    const [gte, setGte] = useState(0);
    const [lte, setLte] = useState(1000);
    const [perpage, setPerpage] = useState(5);

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
                perpage: perpage ? perpage : 5
            }
        }).then((response) => {
            setJobs(response.data);
            setLoading(false);
        });
    }, [page, reload, perpage, lowestPrice, gte, lte]);

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
            <SearchContainer history={history} currentPage={page} setGte={setGte} setLte={setLte} search={search} setSearch={setSearch} jobs={jobs} reload={reload} setReload={setReload} />
            <div className="list-container">
                <Filter loading={loading} jobs={jobs} perpage={perpage} setPerpage={setPerpage} setGte={setGte} setLte={setLte} onlyLiked={onlyLiked} setOnlyLiked={setOnlyLiked} lowestPrice={lowestPrice} setLowestPrice={setLowestPrice} />
                {
                    loading ? (() => {
                        if((Math.floor(Math.random()*3) + 1) === 1)
                            return(<LottieControl animationData={AnimationData1} height="400" style={styles.loadingContainer} />);
                        if((Math.floor(Math.random()*3) + 1) === 2)
                            return(<LottieControl animationData={AnimationData2} height="400" style={styles.loadingContainer} />);
                        else
                            return(<LottieControl animationData={AnimationData3} height="400" style={styles.loadingContainer} />);
                        })() :
                    <div style={{ display:'flex', flexDirection:'column', width:'100%' }}>
                        <List onlyLiked={onlyLiked} jobs={jobs} history={history} />
                        <div style={{ alignSelf:'flex-end', margin:'20px 20px 40px 0' }}>
                            <button onClick={ e => handleChangePage() }>Anterior</button>
                            <button onClick={ e => handleChangePage('NEXT') } style={{ marginLeft:'10px' }}>Seguinte</button>
                        </div>
                    </div>
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

const Filter = ({ loading, jobs, perpage, setPerpage, setGte, setLte, onlyLiked, setOnlyLiked, lowestPrice, setLowestPrice }) => {
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

    const children = [
        <ToggleButton key={1} value="5">
          <label>5</label>
        </ToggleButton>,
        <ToggleButton key={2} value="10">
          <label>10</label>
        </ToggleButton>,
        <ToggleButton key={3} value="15">
          <label>15</label>
        </ToggleButton>,
        <ToggleButton key={4} value="20">
          <label>20</label>
        </ToggleButton>,
      ];

    return(
        <div className="left-container">
            <OrderBy style={{ marginBottom: '25px' }} lowestPrice={lowestPrice} setLowestPrice={setLowestPrice} />
            
            <div className="filter-container">
                <div className="filter-content">
                    <label className="title">Filtros</label>

                    <ToggleButtonGroup size="small" value={perpage} exclusive onChange={(event, newPerpage) => { setPerpage(newPerpage); }}>
                        {children}
                    </ToggleButtonGroup>

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
        flexWrap: 'wrap',
        marginTop: '68px'
    },
    loadingContainer: {
        width: '100%',
        marginTop: '100px'
    }
}