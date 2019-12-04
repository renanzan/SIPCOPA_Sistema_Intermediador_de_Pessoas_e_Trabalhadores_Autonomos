import React, { useState, useEffect } from 'react';
import api from '../../services/api';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import CalculatorDialog from '../../components/Calculator Dialog/CalculatorDialog';

import PencilWriteAnimation from '../../assets/animations/lottie.json/pencil-write.json';
import LottieControl from '../../assets/animations/LottieControl';

export default function EditJobPage({ history, match }) {
    const job_id = match.params.jobId;
    const [loading, setLoading] = useState(true);
    const [job, setJob] = useState();
    
    useEffect(() => {
        setLoading(true);

        (async() => {
            api.post('/job/show', {}, {
                headers: {
                    job_id
                }
            }).then(response => {
                setJob(response.data);
                setLoading(false);
            });
        })();
    }, []);
    
    return(
        <div style={{ alignItems:'center', justifyContent:'center' }} className='main-container'>
            {
                loading ? <LottieControl animationData={PencilWriteAnimation} width="150px" height="150px" /> :
                <div className='main-container'>
                    <EditJob history={history} job={job} />
                </div>
            }
        </div>
    );
}

const EditJob = ({ history, job }) => {
    const [price, setPrice] = useState(job.job.price);
    const [description, setDescription] = useState(job.job.description);

    function handleEditJob() {
      (async() => {
        await api.post('/job/edit', {
          job_id: job.job._id,
          description,
          price
        }, {
          headers: {
            authentication: localStorage.getItem('@sipcopa/token')
          }
        }).then(response => {
          console.log(response.data);
          history.push('/my_account');
        });
      })();
    }
    
    return(
        <div className="main-container" style={{ paddingBottom:120, justifyContent:'center', alignItems:'center'}}>
            <div className="card" style={{ padding:50, minWidth: '25%' }}>
                <label className="card-title">Editar Trabalho</label>
                <TextInput value={job.job.job} label='Trabalho' disabled />
                <TextInput value={description} setValue={setDescription} label='Descrição' multiline rows='3' rowsMax='5'/>
                <TextInput type='number' value={price} setValue={setPrice} label='Preço em bitpoints' />

                <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end' }}>
                    <CalculatorDialog job={job.job.job} setPrice={setPrice} />
                    <ConfirmButton label='Editar trabalho' handle={() => { handleEditJob(); }} />
                    <CancelButton label='Remover trabalho' handle={() => { console.log('Cancel'); }} />
                    <CancelButton label='Cancelar' handle={() => { history.push('/my_account'); }} />
                </div>
            </div>
        </div>
    );
}

const TextInput = ({ type, value, setValue, label, multiline, rows, rowsMax, disabled }) => {
    const useStyles = makeStyles(theme => ({
        textField: {
          width: '100%',
          minWidth: 300,
          marginTop: '20px'
        }
      }));

    const classes = useStyles();

    return(
        <TextField
            id="outlined-number"
            className={classes.textField}
            label={label || ''}
            type={ type || "text"}
            multiline={multiline}
            rows={rows || 1}
            rowsMax={rowsMax || 1}
            value={value}
            onChange={ !setValue ? e => {} : e => { setValue(e.target.value) }}
            InputLabelProps={{
                shrink: true,
            }}
            disabled={disabled}
            margin="normal"
            variant="outlined"
        />
    );
}

const ConfirmButton = ({ handle, label }) => {
    const BootstrapButton = withStyles({
        root: {
          boxShadow: 'none',
          textTransform: 'none',
          fontVariant: 'small-caps',
          fontWeight: '300',
          fontSize: 14,
          padding: '6px 12px',
          border: '1px solid',
          lineHeight: 1.5,
          backgroundColor: '#2AABCC',
          marginTop: '40px',
          width: '200px',
          fontFamily: [
            'Roboto',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
          ].join(','),
          '&:hover': {
            backgroundColor: '#4796AA !important',
            boxShadow: 'none',
          },
          '&:active': {
            boxShadow: 'none',
            // backgroundColor: '#0062cc',
            // borderColor: '#005cbf',
          },
          '&:focus': {
            // boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
          },
        },
      })(Button);

    const useStyles = makeStyles(theme => ({
        button: {
          margin: theme.spacing(1),
        }
      }));

      const classes = useStyles();

      return (
          <div>
            <BootstrapButton variant="contained" color="primary" className={classes.margin} onClick={e => { handle(); }}>{ label ? label : 'Adicionar' }</BootstrapButton>
        </div>
      );
}

const CancelButton = ({ handle, label }) => {
    const BootstrapButton = withStyles({
        root: {
          boxShadow: 'none',
          textTransform: 'none',
          fontVariant: 'small-caps',
          fontWeight: '300',
          marginTop: 5,
          fontSize: 14,
          padding: '6px 12px',
          lineHeight: 1.5,
          backgroundColor: 'transparent !important',
          color: 'red',
          width: '200px',
          fontFamily: [
            'Roboto',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
          ].join(','),
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.1) !important',
            boxShadow: 'none',
          },
          '&:active': {
            boxShadow: 'none',
            // backgroundColor: '#0062cc',
            // borderColor: '#005cbf',
          },
          '&:focus': {
            // boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
          },
        },
      })(Button);

    const useStyles = makeStyles(theme => ({
        button: {
          margin: theme.spacing(1),
        }
      }));

      const classes = useStyles();

      return (
          <div>
            <BootstrapButton variant="contained" color="primary" className={classes.margin} onClick={e => { handle(); }}>{ label ? label : 'Cancelar' }</BootstrapButton>
        </div>
      );
}