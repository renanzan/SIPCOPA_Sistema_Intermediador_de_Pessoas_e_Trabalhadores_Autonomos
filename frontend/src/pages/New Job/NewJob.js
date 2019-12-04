import React from 'react';

import api from '../../services/api';

import CalculatorDialog from '../../components/Calculator Dialog/CalculatorDialog';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

export default function NewJob({ history }) {
    const [job, setJob] = React.useState();
    const [description, setDescription] = React.useState();
    const [price, setPrice] = React.useState();

    const handleAddWork = () => {
        api.post('/job/new', {
            job,
            description,
            price
        }, {
            headers: {
                authentication: localStorage.getItem('@sipcopa/token')
            }
        }).then(() => {
            history.push('/my_account');
        });
    }

    return(
        <div className="main-container" style={{ paddingBottom:120, justifyContent:'center', alignItems:'center'}}>
            <div className="card" style={{ padding:50, minWidth: '25%' }}>
                <label className="card-title">Adicionar Trabalho</label>
                <InputTipo job={job} setJob={setJob} />
                <InputDescription description={description} setDescription={setDescription} />
                <InputValue price={price} setPrice={setPrice} />

                <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end' }}>
                    <CalculatorDialog job={job} setPrice={setPrice} />
                    <ConfirmButton handleAddWork={handleAddWork} />
                    <CancelButton handleAddWork={handleAddWork} />
                </div>
            </div>
        </div>
    );
}

const InputTipo = ({ job, setJob }) => {
    const inputLabel = React.useRef(null);
    
    const [myJobs, setMyJobs] = React.useState([]);
    const [jobOptions, setJobOptions] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
      setLoading(true);

      (async () => {
          await api.post('/professional_profile', {}, {
            headers: {
              authentication: localStorage.getItem('@sipcopa/token')
            }
          }).then(response => {
            response.data.jobs.forEach(element => {
              setMyJobs(myJobs => [...myJobs, element.job]);
            });
          });

          await api.get('get_job_option').then(response => {
            setJobOptions(response.data);
            setLoading(false);
          });
      })();
    }, []);

    var array_difference;

    if(!loading)
      array_difference = jobOptions.filter(x => !myJobs.includes(x.toString()));

    const [labelWidth, setLabelWidth] = React.useState(0);
    React.useEffect(() => {
        setLabelWidth(inputLabel.current.offsetWidth);
    }, []);
    
    return(
        <FormControl variant="outlined" style={{ marginTop:50 }}>
            <InputLabel ref={inputLabel} id="job-label">Trabalho</InputLabel>
            <Select
                labelId="job-label"
                id="select-job"
                value={job}
                onChange={e => { setJob(e.target.value); }}
                labelWidth={labelWidth}
                style={{ width:'100%', minWidth: 300 }}>
                    
                {
                    array_difference ?
                      array_difference.map((element, index) => {
                            return(
                                <MenuItem key={index} value={element}>{element}</MenuItem>
                            );
                        })
                    : null
                }

            </Select>
        </FormControl>
    );
}

const InputDescription = ({ description, setDescription }) => {
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
                id="outlined-basic"
                className={classes.textField}
                label="Descrição"
                multiline
                value={description}
                onChange={e => { setDescription(e.target.value); }}
                rows="3"
                rowsMax="5"
                margin="normal"
                variant="outlined" />
    );
}

const InputValue = ({ price, setPrice }) => {
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
            label="Valor em pontos"
            type="number"
            value={price}
            onChange={e => { setPrice(e.target.value); }}
            className={classes.textField}
            InputLabelProps={{
                shrink: true,
            }}
            margin="normal"
            variant="outlined"
        />
    );
}

const ConfirmButton = ({ handleAddWork }) => {
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
            <BootstrapButton variant="contained" color="primary" className={classes.margin} onClick={e => { handleAddWork(); }}>Adicionar</BootstrapButton>
        </div>
      );
}

const CancelButton = ({ handleAddWork }) => {
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
            <BootstrapButton variant="contained" color="primary" className={classes.margin} onClick={e => { handleAddWork(); }}>Cancelar</BootstrapButton>
        </div>
      );
}