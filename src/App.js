import React from 'react';

import Input from './Components/Input';
import Radio from "./Components/Radio";
import Selected from "./Components/Selected";

const validRegex = RegExp(/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/i);

const validateForm = (errors) => {
    let valid = true;
    Object.values(errors).forEach(
        (val) => val.length > 0 && (valid = false)
    );
    return valid;
}


class App extends React.Component {
    state = {
        ethernetIp: {
            IpMethod: 'auto'
        },
        ethernetDns: {
            DnsMethod: 'auto'
        },
        wireless: {
            enableWifi: false,
            enableWifiSecurity: false
        },
        wirelessIp: {},
        wirelessDns: {},
        ethernetErrors: {
            'IP address': '',
            'Subnet Mask': '',
            'Preferred DNS server': ''
        },
        wirelessErrors: {
            selectedOption: '',
            'IP address': '',
            'Subnet Mask': '',
            'Security Key': '',
            'Preferred DNS server': ''
        }

    };

    handleChangeRadio = (name, field, value) => {
        if (value === 'manually' && (field === 'ethernetIp' || field === 'wirelessIp')) {
            this.setState({
                [field]: {
                    [name]: value,
                    'IP address': '',
                    'Subnet Mask': ''
                }
            })
        } else if (value === 'manually' && (field === 'ethernetDns' || field === 'wirelessDns')) {
            this.setState({
                [field]: {
                    [name]: value,
                    'Preferred DNS server': ''
                }
            })
        } else {
            let fieldErrors = (field === 'ethernetIp' || field === 'ethernetDns') ?
                'ethernetErrors' : 'wirelessErrors';
            let typeError = (field === 'ethernetIp' || field === 'wirelessIp') ?
                {
                    'IP address': '',
                    'Subnet Mask': ''
                } :
                {'Preferred DNS server': ''};

            this.setState({
                [field]: {
                    [name]: value
                },
                [fieldErrors]: {
                    ...this.state[fieldErrors],
                    ...typeError
                }
            })
        }
    };

    handleClearName = () => {
        this.setState({
            wireless: {
                ...this.state.wireless,
                selectedOption: null
            },
            wirelessErrors: {
                ...this.state.wirelessErrors,
                selectedOption: 'This field is required. Please, select name.'
            }
        })
    };

    handleChangeCheckbox = () => {
        let errorsEmpty = this.state.wirelessErrors;

        for (let key in errorsEmpty)
            if (errorsEmpty.hasOwnProperty(key)) {
                errorsEmpty[key] = ''
            }
        ;

        !this.state.wireless.enableWifi ?
            this.setState({
                wireless: {
                    enableWifi: !this.state.wireless.enableWifi,
                    enableWifiSecurity: false,
                    selectedOption: null
                },
                wirelessIp: {
                    IpMethod: 'auto'
                },
                wirelessDns: {
                    DnsMethod: 'auto'
                }
            }) :
            this.setState({
                wireless: {
                    enableWifi: !this.state.wireless.enableWifi,
                    enableWifiSecurity: false
                },
                wirelessIp: {},
                wirelessDns: {},
                wirelessErrors: errorsEmpty
            })

    };

    handleCheckSecurity = (e) => {
        const {wireless} = this.state;
        !wireless.enableWifiSecurity ?
            this.setState({
                wireless: {
                    ...wireless,
                    enableWifiSecurity: !wireless.enableWifiSecurity,
                    'Security Key': ''
                },
                wirelessErrors: {
                    ...this.state.wirelessErrors,
                    'Security Key': ''
                }
            }) :
            this.setState({
                wireless: {
                    enableWifi: true,
                    enableWifiSecurity: !wireless.enableWifiSecurity,
                    selectedOption: wireless.selectedOption
                },
                wirelessErrors: {
                    ...this.state.wirelessErrors,
                    'Security Key': ''
                }
            })
    };

    handleChangeInput = (event, name, field) => {
        let {value} = event.target;
        let fieldError = (field === 'ethernetIp' || field === 'ethernetDns') ?
            'ethernetErrors' : 'wirelessErrors';
        let errors = this.state[fieldError];

        switch (name) {
            case 'Security Key':
                errors[name] =
                    value.length > 8
                        ? ''
                        : `${name} must be >8 symbols`;
                break;
            case 'Default Gateway':
                break;
            case 'Alternative DNS server':
                break;
            default:
                errors[name] =
                    validRegex.test(value)
                        ? ''
                        : value.length > 0
                        ? `${name} is not valid`
                        : `This field is required!`;
                break
        }

        this.setState({
            [field]: {
                ...this.state[field],
                [name]: value
            }
        })
    };

    handleChangeInputNoValid = (event, name, field) => {
        let {value} = event.target;
        if (value.length) {
            this.setState({
                [field]: {
                    ...this.state[field],
                    [name]: value
                }
            })
        } else {
            let delState = this.state[field];
            delete delState[name];
            this.setState({
                [field]: {
                    ...delState
                }
            })
        }
    };


    handleSelect = (selectedOption) => {
        this.setState({
            wireless: {
                ...this.state.wireless,
                selectedOption
            }, wirelessErrors: {
                ...this.state.wirelessErrors,
                selectedOption: ''
            }
        })
    };


    handleSubmit = (event) => {
        event.preventDefault();
        const {ethernetIp, ethernetDns, wireless, wirelessIp, wirelessDns} = this.state;
        const data = {
            ethernet: {
                ...ethernetIp,
                ...ethernetDns
            },
            wireless: {
                ...wireless,
                ...wirelessIp,
                ...wirelessDns
            }
        }
        let allErrors = {};

        for (let key in data) {
            const errorsName = key + 'Errors';
            let errorsNameObj = {...this.state[errorsName]};
            for (let prop in data[key]) {
                if (data[key][prop] === '' || data[key][prop] === null) {
                    errorsNameObj = {
                        ...errorsNameObj,
                        [prop]: 'This field is required!'
                    };
                }
            }
            allErrors = {
                ...allErrors,
                [errorsName]: {...errorsNameObj}
            }
        }

        this.setState({
            ...this.state,
            ...allErrors
        });

        if (validateForm(allErrors.ethernetErrors) && validateForm(allErrors.wirelessErrors)) {
            console.info('Valid Form')

            if (data.wireless.selectedOption) {
                delete data.wireless.selectedOption;
                data.wireless['Wireless Network Name'] = wireless.selectedOption.value
            }
            console.log(data)
        } else {
            console.error('Invalid Form')
        }
    };

    handleClearForm = () => {
        this.setState({
            ethernetIp: {
                IpMethod: 'auto'
            },
            ethernetDns: {
                DnsMethod: 'auto'
            },
            wireless: {
                enableWifi: false,
                enableWifiSecurity: false
            },
            wirelessIp: {},
            wirelessDns: {},
            ethernetErrors: {
                'IP address': '',
                'Subnet Mask': '',
                'Preferred DNS server': ''
            },
            wirelessErrors: {
                selectedOption: '',
                'IP address': '',
                'Subnet Mask': '',
                'Security Key': '',
                'Preferred DNS server': ''
            }})
    };


    render() {
        const {ethernetIp, ethernetDns, wireless, wirelessIp, wirelessDns, ethernetErrors, wirelessErrors} = this.state;
        return (
            <main>
                <form className={'form'} onSubmit={this.handleSubmit} noValidate>
                    <div className="ethernet">
                        <h3 className={'title'}>Ethernet Settings</h3>
                        <Radio name={'IpMethod'}
                               field={'ethernetIp'}
                               value={'auto'}
                               text={'Obtain an IP address automatically (DHCP/BootP)'}
                               checked={ethernetIp.IpMethod === 'auto'}
                               onChange={this.handleChangeRadio}/>
                        <Radio name={'IpMethod'}
                               field={'ethernetIp'}
                               value={'manually'}
                               text={'Use the following IP address:'}
                               checked={ethernetIp.IpMethod === 'manually'}
                               onChange={this.handleChangeRadio}/>
                        <Input name={'IP address'}
                               required={true}
                               field={'ethernetIp'}
                               value={ethernetIp['IP address']}
                               error={ethernetErrors}
                               disabled={ethernetIp.IpMethod !== 'manually'}
                               onChange={this.handleChangeInput}/>
                        <Input name={'Subnet Mask'}
                               required={true}
                               field={'ethernetIp'}
                               value={ethernetIp['Subnet Mask']}
                               error={ethernetErrors}
                               disabled={ethernetIp.IpMethod !== 'manually'}
                               onChange={this.handleChangeInput}/>
                        <Input name={'Default Gateway'}
                               disabled={ethernetIp.IpMethod !== 'manually'}
                               onChange={this.handleChangeInputNoValid}
                               value={ethernetIp['Default Gateway']}
                               field={'ethernetIp'}/>
                        <Radio name={'DnsMethod'}
                               field={'ethernetDns'}
                               value={'auto'}
                               text={'Obtain DNS server address automatically'}
                               checked={ethernetDns.DnsMethod === 'auto'}
                               onChange={this.handleChangeRadio}/>
                        <Radio name={'DnsMethod'}
                               field={'ethernetDns'}
                               value={'manually'}
                               text={'Use the following DS server address:'}
                               checked={ethernetDns.DnsMethod === 'manually'}
                               onChange={this.handleChangeRadio}/>
                        <Input name={'Preferred DNS server'}
                               required={true}
                               field={'ethernetDns'}
                               value={ethernetDns['Preferred DNS server']}
                               disabled={ethernetDns.DnsMethod !== 'manually'}
                               onChange={this.handleChangeInput}
                               error={ethernetErrors}/>
                        <Input name={'Alternative DNS server'}
                               field={'ethernetDns'}
                               value={ethernetDns['Alternative DNS server']}
                               onChange={this.handleChangeInputNoValid}
                               disabled={ethernetDns.DnsMethod !== 'manually'}/>
                    </div>

                    <div className="wireless">
                        <h3 className={'title'}>Wireless Settings</h3>
                        <label className={'check'}>
                            <input className={'check__input'}
                                   type="checkbox"
                                   checked={wireless.enableWifi}
                                   onChange={this.handleChangeCheckbox}/>
                            <span className={'check__text'}>Enable wifi:</span>
                        </label>
                        <Selected isDisabled={wireless.enableWifi}
                                  error={wirelessErrors.selectedOption}
                                  value={wireless.selectedOption}
                                  onChange={this.handleSelect}
                                  onClick={this.handleClearName}/>
                        <label className={'check'}>
                            <input className={'check__input'} type="checkbox"
                                   disabled={!wireless.enableWifi}
                                   checked={wireless.enableWifiSecurity}
                                   onChange={this.handleCheckSecurity}/>
                            <span className={'check__text'}>Enable Wireless Security:</span>
                        </label>
                        <Input name={'Security Key'}
                               required={true}
                               type={'password'}
                               field={'wireless'}
                               disabled={!wireless.enableWifiSecurity}
                               onChange={this.handleChangeInput}
                               value={wireless['Security Key']}
                               error={wirelessErrors}/>
                        <Radio name={'IpMethod'}
                               field={'wirelessIp'}
                               value={'auto'}
                               text={'Obtain an IP address automatically (DHCP/BootP)'}
                               checked={wirelessIp.IpMethod === 'auto'}
                               disabled={!wireless.enableWifi}
                               onChange={this.handleChangeRadio}/>
                        <Radio name={'IpMethod'}
                               field={'wirelessIp'}
                               value={'manually'}
                               text={'Use the following IP address:'}
                               checked={wirelessIp.IpMethod === 'manually'}
                               disabled={!wireless.enableWifi}
                               onChange={this.handleChangeRadio}/>
                        <Input name={'IP address'}
                               field={'wirelessIp'}
                               required={true}
                               value={wirelessIp['IP address']}
                               disabled={wirelessIp.IpMethod !== 'manually'}
                               error={wirelessErrors}
                               onChange={this.handleChangeInput}/>
                        <Input name={'Subnet Mask'}
                               field={'wirelessIp'}
                               required={true}
                               value={wirelessIp['Subnet Mask']}
                               disabled={wirelessIp.IpMethod !== 'manually'}
                               error={wirelessErrors}
                               onChange={this.handleChangeInput}/>
                        <Input name={'Default Gateway'}
                               field={'wirelessIp'}
                               onChange={this.handleChangeInputNoValid}
                               value={wirelessIp['Default Gateway']}
                               disabled={wirelessIp.IpMethod !== 'manually'}/>
                        <Radio name={'DnsMethod'} value={'auto'}
                               field={'wirelessDns'}
                               text={'Obtain DNS server address automatically'}
                               checked={wirelessDns.DnsMethod === 'auto'}
                               disabled={!wireless.enableWifi}
                               onChange={this.handleChangeRadio}/>
                        <Radio name={'DnsMethod'}
                               field={'wirelessDns'}
                               value={'manually'}
                               text={'Use the following DS server address:'}
                               checked={wirelessDns.DnsMethod === 'manually'}
                               disabled={!wireless.enableWifi}
                               onChange={this.handleChangeRadio}/>
                        <Input name={'Preferred DNS server'}
                               field={'wirelessDns'}
                               required={true}
                               value={wirelessDns['Preferred DNS server']}
                               disabled={wirelessDns.DnsMethod !== 'manually'}
                               error={wirelessErrors}
                               onChange={this.handleChangeInput}/>
                        <Input name={'Alternative DNS server'}
                               field={'wirelessDns'}
                               onChange={this.handleChangeInputNoValid}
                               value={wirelessDns['Alternative DNS server']}
                               disabled={wirelessDns.DnsMethod !== 'manually'}/>
                    </div>

                    <div className="buttons">
                        <button type={'submit'} className={'button__save'}>Save</button>
                        <button type={'reset'}
                                className={'button__cancel'}
                                onClick={this.handleClearForm}
                        >Cancel</button>
                    </div>
                </form>
            </main>
        )
    }
}

export default App;