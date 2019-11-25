import React from 'react';

import api from '../../services/api';

import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';

export default function ContractJob({ history, match }) {
    const userId = match.params.userId;
    const jobId = match.params.jobId;

    const [loading, setLoading] = React.useState(true);
    const [professionalProfile, setProfessionalProfile] = React.useState();
    const [job, setJob] = React.useState();

    React.useEffect(() => {
        (async() => {
            api.post('/job/show', {}, {
                headers: {
                    user_id: userId,
                    job_id: jobId
                }
            }).then(response => {
                setProfessionalProfile(response.data.professionalProfile);
                setJob(response.data.job);
                setLoading(false);
            });
        })();
    },[]);

    return(
        <div className='main-container' style={{ alignItems:'center', justifyContent:'center' }}>
            {
                loading ?
                    <div style={{ background:'black', color:'red', fontSize:'36px', fontWeight:1000 }}>Loading...</div> :
                <Contract history={history} professionalProfile={professionalProfile} job={job} />
            }
        </div>
    );
}

const Contract = ({ history, professionalProfile, job }) => {
    const [observation, setObservation] = React.useState();
    const [payment, setPayment] = React.useState('bitpoints');

    async function handleFinalizar() {
        await api.post('/contract/new', {
            employee: professionalProfile._id,
            job: job._id,
            price: job.price,
            note: observation,
            form_of_payment: payment
        }, {
            headers: {
                authentication: localStorage.getItem('@sipcopa/token')
            }
        }).then(response => {
            console.log(response.data);
            if(response.data.error)
                console.log(response.data.error);
            else {
                history.push('/history');
                window.location.reload();
            }
        });
    }
    
    return(
        <div>
            <div className="card" style={{ minWidth:'600px', width:'30%', minHeight:'300px', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
                <label style={{ margin:'10px 0 20px 0', alignSelf:'center', textTransform:'uppercase', fontFamily:'Roboto', fontWeight:500, fontSize:'14px' }}>Contrato de prestação de serviço</label>
                <div>
                    <label style={{ fontSize:'12px', color:'#B4B4B4' }}>Pessoa jurídica</label>
                    <div style={{ background:'#FBFBFD', padding:'10px 25px' }}>
                        <label style={{ fontFamily:'Roboto', color:'rgba(0, 0, 0, 0.6)' }}>{ professionalProfile.fullName }</label>
                    </div>
                </div>
                <hr style={{ borderTop:'1px solid #FBFBFD' }} />
                <div>
                    <label style={{ fontSize:'12px', color:'#B4B4B4' }}>Serviço</label>
                    <div style={{ background:'#FBFBFD', fontFamily:'Roboto', color:'rgba(0, 0, 0, 0.6)', padding:'10px 25px' }}>
                        <label style={{ fontWeight:600 }}>{ job.job }</label><br />
                        <label style={{ fontWeight:300, fontSize:'12px' }}>{ job.description }</label>
                    </div>
                </div>
                <hr style={{ borderTop:'1px solid #FBFBFD' }} />
                <div style={{ padding:'10px 20px', fontFamily:'Roboto', fontWeight:600, display:'flex', justifyContent:'space-between' }}>
                    <label>Valor</label>
                    <label>{ job.price } bitpoints</label>
                </div>
            </div>

            <div style={{ marginTop:'20px', minWidth:'600px', width:'30%', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
                <TextField
                    id="outlined-basic"
                    label="Alguma observação?"
                    helperText="Ex.: Hora, localização, contato"
                    multiline
                    value={observation}
                    onChange={e => { setObservation(e.target.value); }}
                    rows="1"
                    rowsMax="3"
                    margin="normal"
                    variant="outlined" />
                <FormControl component="fieldset" style={{ marginTop:'20px' }}>
                    <label style={{ fontSize:'12px', color:'#B4B4B4' }}>Forma de pagamento</label>
                    <RadioGroup aria-label="pagamento" defaultValue="bitpoints" name="payment" value={payment} onChange={e => { setPayment(e.target.value); }} row>
                        <FormControlLabel value="bitpoints" defaultChecked control={<Radio color="primary" />} label="Bitpoints" />
                        <FormControlLabel value="debit" control={<Radio color="primary" />} label="Dinheiro" />
                        <FormControlLabel value="credit" disabled control={<Radio color="primary" />} label="Cartão de crédito" />
                    </RadioGroup>
                </FormControl>
                <div style={{ marginTop:'20px', width:'60%', alignSelf:'flex-end', display:'flex', flexDirection:'row' }}>
                    <input type='submit' style={{ flex:1, marginRight:'10px' }} value='Cancelar' />
                    <Button variant="contained" color="secondary" style={{ flex:2 }} onClick={ handleFinalizar } >Finalizar</Button>
                </div>
            </div>
        </div>
    );
}