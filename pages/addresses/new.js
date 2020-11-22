import * as React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import {gql} from '@apollo/client'
import * as hooks from 'hooks'
import * as utils from 'utils'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import Typography from '@material-ui/core/Typography'
import PageHeader from 'components/PageHeader'

const GET_ADDRESSES = gql`
  query getAddresses {
    addresses {
      id
      name
    }
  }
`

const CREATE_ADDRESS = gql`
  mutation createAddress($dawaId: ID!) {
    createAddress(dawaId: $dawaId) {
      address {
        id
      }
    }
  }
`

export default function AddressesNew(props) {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [options, setOptions] = React.useState([])
  const [selectedAddress, setSelectedAddress] = React.useState(null)

  const client = hooks.useClient()
  const router = hooks.useRouter()

  const searchDAWA = (searchTerm) => {
    setLoading(true)
    fetch('https://dawa.aws.dk/adresser/autocomplete?fuzzy&q=' + encodeURIComponent(searchTerm))
      .then((response) => response.json())
      .then((addresses) => {
        if (Array.isArray(addresses)) {
          setOptions(addresses.map((address) => ({id: address.adresse.id, text: address.tekst})))
        } else {
          setOptions([])
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  React.useEffect(() => {
    if (searchTerm.length) {
      searchDAWA(searchTerm)
    } else {
      setOptions([])
    }
  }, [searchTerm])

  React.useEffect(() => {
    if (!open) {
      setOptions([])
    }
  }, [open])

  return (
    <>
      <Head>
        <title>Suitable - Tilføj adresse</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageHeader>Tilføj adresse</PageHeader>
      <Box pt={2}>
        <Autocomplete
          // id="asynchronous-demo"
          style={{width: 500}}
          freeSolo
          inputValue={searchTerm}
          onInputChange={(_, searchTerm) => setSearchTerm(searchTerm)}
          onChange={(_, address) => {
            setSelectedAddress(address)
          }}
          // openOnFocus
          open={open}
          onOpen={() => {
            setOpen(true)
          }}
          onClose={() => {
            setOpen(false)
          }}
          filterOptions={(options) => options}
          getOptionSelected={(option, value) => option.id === value.id}
          getOptionLabel={(option) => option.text}
          options={options}
          loading={loading}
          renderInput={(params) => (
            <TextField
              {...params}
              // fullWidth
              // placeholder="Søg efter adresse ..."
              label="Søg efter adresse"
              variant="outlined"
              inputProps={{
                ...params.inputProps,
                autoComplete: 'new-password',
              }}
            />
          )}
        />
      </Box>
      <Box pt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            if (!selectedAddress) return
            client
              .mutate({mutation: CREATE_ADDRESS, variables: {dawaId: selectedAddress.id}})
              .then(({data}) => {
                router.push('/addresses/' + data.createAddress.address.id)
              })
              .catch(utils.handleError)
          }}
        >
          Gem
        </Button>
      </Box>
    </>
  )
}
