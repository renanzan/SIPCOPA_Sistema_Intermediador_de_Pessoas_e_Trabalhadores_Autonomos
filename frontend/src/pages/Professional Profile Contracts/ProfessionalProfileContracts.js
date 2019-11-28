import React from 'react';

import './professional_profile_contracts.css';
import api from '../../services/api';

export default function ProfessionalProfileContracts() {
    return(
        <div className='main-container'>
            <label style={{ alignSelf:'center', fontVariant:'small-caps', fontWeight:600, letterSpacing:'2px', margin:'20px 0' }}>Seus contratos</label>
            <ListContracts />
        </div>
    );
}

const ListContracts = () => {
    const [loading, setLoading] = React.useState(true);
    const [contracts, setContracts] = React.useState();
    const [professionalProfile, setProfessionalProfile] = React.useState();

    React.useEffect(() => {
        setLoading(true);
        (async () => {
            await api.post('/contracts', {}, {
                headers: {
                    authentication: localStorage.getItem('@sipcopa/token')
                }
            }).then(response => {
                setContracts(response.data);
            });

            await api.post('/professional_profile', {}, {
                headers: {
                    authentication: localStorage.getItem('@sipcopa/token')
                }
            }).then(response => {
                setProfessionalProfile(response.data.professionalProfile);
            });

            setLoading(false);
        })();
    }, []);

    return(
        <div style={{ width:'50%', minWidth:'500px', maxWidth:'800px', display:'flex', flexDirection:'row', flexWrap: 'wrap', justifyContent:'center', alignItems:'center', alignSelf:'center' }}>
            {
                loading ? <div>loading</div> :
                contracts.map((element, index) => {
                    return(
                        <JobCard professionalProfile={professionalProfile} key={index} contract={element} />
                    );
                })
            }
        </div>
    );
}

const JobCard = ({ professionalProfile, contract }) => {
    const [loading, setLoading] = React.useState(true);
    const [job, setJob] = React.useState();
    const [user, setUser] = React.useState();

    React.useEffect(() => {
        if(loading)
            (async() => {
                await api.post('/job/show', {}, {
                    headers: {
                        user_id: contract.employer,
                        job_id: contract.job
                    }
                }).then(response => {
                    setJob(response.data.job);
                    (async() => {
                        await api.post('/getUser', {}, {
                            headers: {
                                user_id: contract.employer
                            }
                        }).then(response => {
                            setUser(response.data);
                            setLoading(false);
                        });
                    })();
                });
            })();
    }, [loading]);

    function handleUpdateContractStatus(status) {
        api.post('/contract/update', {
            contract: contract._id,
            my_professional_profile_id: professionalProfile._id,
            status
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
                    <label style={{ alignSelf:'flex-end', fontSize:'12px', color:'rgba(0, 0, 0, 0.35)' }}>{ `${String(createdAt.getDate()).padStart(2, '0')}/${createdAt.getMonth()+1}/${createdAt.getFullYear()} ${String(createdAt.getHours()).padStart(2, '0')}:${String(createdAt.getMinutes()).padStart(2, '0')}:${String(createdAt.getSeconds()).padStart(2, '0')}` }</label>
                    <div style={{ display:'flex', flexDirection:'column', margin:'10px 0' }}>
                        <label style={{ fontWeight:600, alignSelf:'center' }}>{ job.job }</label>
                        <label style={{ fontSize:'14px', color:'rgba(0, 0, 0, 0.8)', alignSelf:'center' }}>{ user.username }</label>
                        <label style={{ fontSize:'14px', color:'rgba(0, 0, 0, 0.8)', alignSelf:'center' }}>{ user.email }</label>
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
                            : contract.status === 'open' ?
                                <label style={{ fontSize:'14px', color:'rgba(0, 0, 0, 0.8)', backgroundColor:'green', padding:'0 10px' }}>aberto</label>
                            : contract.status === 'close' ?
                                <label style={{ fontSize:'14px', color:'rgba(0, 0, 0, 0.8)' }}>concluido</label>
                            :
                                <label style={{ fontSize:'14px', color:'rgba(0, 0, 0, 0.8)' }}>{ contract.status }</label>
                        }
                            <span className="tooltiptext">
                                { `${String(updatedAt.getDate()).padStart(2, '0')}/${updatedAt.getMonth()+1}/${updatedAt.getFullYear()} ${String(updatedAt.getHours()).padStart(2, '0')}:${String(updatedAt.getMinutes()).padStart(2, '0')}:${String(updatedAt.getSeconds()).padStart(2, '0')}` }
                            </span>
                        </div>
                    </div>
                    
                    {
                        contract.status === 'refused' ? null :
                            contract.status === 'pending' ?
                                <div style={{ display:'flex', flexDirection:'column', flex:1, justifyContent:'flex-end' }}>
                                    <input type='submit' value='Cancelar' onClick={ e => handleUpdateContractStatus('refused') } />
                                    <input type='submit' value='Aceitar' onClick={ e => handleUpdateContractStatus('open') } />
                                </div>
                            : contract.status === 'open' ?
                                <div style={{ display:'flex', flexDirection:'column', flex:1, justifyContent:'flex-end' }}>
                                    <input type='submit' value='Confirmar conclusão do serviço' onClick={ e => handleUpdateContractStatus('close') } />
                                </div>
                            : null
                    }
                </div>
            }
        </div>
    );
}