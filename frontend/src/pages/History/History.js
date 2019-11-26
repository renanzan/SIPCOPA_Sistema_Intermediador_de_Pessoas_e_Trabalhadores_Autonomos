import React from 'react';

import './history.css';
import api from '../../services/api';

export default function History() {
    return(
        <div className='main-container'>
            <label style={{ alignSelf:'center', fontVariant:'small-caps', fontWeight:600, letterSpacing:'2px', margin:'20px 0' }}>Histórico de contratações</label>
            <ListContracts />
        </div>
    );
}

const ListContracts = () => {
    const [loading, setLoading] = React.useState(true);
    const [contracts, setContracts] = React.useState();

    React.useEffect(() => {
        setLoading(true);
        (async () => {
            await api.post('/contract/history', {}, {
                headers: {
                    authentication: localStorage.getItem('@sipcopa/token')
                }
            }).then(response => {
                setContracts(response.data);
                setLoading(false);
            });
        })();
    }, []);

    return(
        <div style={{ width:'50%', minWidth:'500px', maxWidth:'800px', display:'flex', flexDirection:'row', flexWrap: 'wrap', justifyContent:'center', alignItems:'center', alignSelf:'center' }}>
            {
                loading ? <div>loading</div> :
                contracts.map((element, index) => {
                    return(
                        <JobCard key={index} contract={element} />
                    );
                })
            }
        </div>
    );
}

const JobCard = ({ contract }) => {
    const [loading, setLoading] = React.useState(true);
    const [professionalProfile, setProfessionalProfile] = React.useState();
    const [job, setJob] = React.useState();

    React.useEffect(() => {
        if(loading)
            (async() => {
                await api.post('/job/show', {}, {
                    headers: {
                        user_id: contract.employer,
                        job_id: contract.job
                    }
                }).then(response => {
                    setProfessionalProfile(response.data.professionalProfile);
                    setJob(response.data.job);
                    setLoading(false);
                });
            })();
    }, [loading]);

    function handleCancelar() {
        api.post('/contract/update', {
            contract: contract._id,
            status:'refused'
        }, {
            headers: {
                authentication: localStorage.getItem('@sipcopa/token')
            }
        });

        window.location.reload();
    }

    const createdAt = new Date(contract.createdAt);
    const updatedAt = new Date(contract.updatedAt);

    return(
        <div>
            {
                loading ? <div>loading</div> :
                <div style={{ background:'white', margin:'10px', display:'flex', flexDirection:'column', width:'300px', minHeight:'200px', padding:'10px', borderRadius:'4px', boxShadow:'0 0 5px rgba(0, 0, 0, 0.25)' }}>
                    <label style={{ alignSelf:'flex-end', fontSize:'12px', color:'rgba(0, 0, 0, 0.35)' }}>{ `${String(createdAt.getDate()).padStart(2, '0')}/${createdAt.getMonth()}/${createdAt.getFullYear()} ${String(createdAt.getHours()).padStart(2, '0')}:${String(createdAt.getMinutes()).padStart(2, '0')}:${String(createdAt.getSeconds()).padStart(2, '0')}` }</label>
                    <div style={{ display:'flex', flexDirection:'column', margin:'10px 0' }}>
                        <label style={{ fontWeight:600, alignSelf:'center' }}>{ job.job }</label>
                        <label style={{ fontSize:'14px', color:'rgba(0, 0, 0, 0.8)', alignSelf:'center' }}>{ professionalProfile.fullName }</label>
                        <label style={{ fontSize:'14px', color:'rgba(0, 0, 0, 0.35)', margin:'10px 0' }}>{ contract.note }</label>
                        <div style={{ display:'flex', justifyContent:'space-between' }}>
                            <label style={{ fontSize:'14px', color:'rgba(0, 0, 0, 0.35)' }}>{ contract.form_of_payment === 'debit' ? 'Débito' : 'Bitpoints'  }</label>
                            <label style={{ fontSize:'14px', color:'rgba(0, 0, 0, 0.8)' }}>{ contract.price }</label>
                        </div>
                    </div>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'10px' }}>
                        <label style={{ fontSize:'14px', color:'rgba(0, 0, 0, 0.35)' }}>Status</label>
                        <div className="tooltip">
                        {
                            contract.status === 'pending' ?
                                <label style={{ fontSize:'14px', color:'rgba(0, 0, 0, 0.8)', backgroundColor:'yellow', padding:'0 10px' }}>pendente</label>
                            : contract.status === 'refused' ?
                                <label style={{ fontSize:'14px', color:'rgba(0, 0, 0, 0.8)', backgroundColor:'red', padding:'0 10px' }}>cancelado</label>
                            :
                                <label style={{ fontSize:'14px', color:'rgba(0, 0, 0, 0.8)' }}>{ contract.status }</label>
                        }
                            <span className="tooltiptext">
                                { `${String(updatedAt.getDate()).padStart(2, '0')}/${updatedAt.getMonth()}/${updatedAt.getFullYear()} ${String(updatedAt.getHours()).padStart(2, '0')}:${String(updatedAt.getMinutes()).padStart(2, '0')}:${String(updatedAt.getSeconds()).padStart(2, '0')}` }
                            </span>
                        </div>
                    </div>
                    
                    {
                        contract.status === 'refused' ? null :
                            contract.status === 'pending' ?
                                <div style={{ display:'flex', flexDirection:'column', flex:1, justifyContent:'flex-end' }}>
                                    <input type='submit' value='Cancelar' onClick={ handleCancelar } />
                                </div>
                            :
                                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'20px' }}>
                                    <label style={{ fontSize:'14px', color:'rgba(0, 0, 0, 0.35)' }}>Avalie o serviço</label>
                                    <div style={{ display:'flex', flexDirection:'row' }}>
                                        <input type='submit' value='X' />
                                        <input type='submit' value='X' />
                                        <input type='submit' value='X' />
                                        <input type='submit' value='X' />
                                        <input type='submit' value='X' />
                                    </div>
                                </div>
                    }
                </div>
            }
        </div>
    );
}