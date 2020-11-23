import React from 'react'
import Head from 'next/head'
import {gql} from '@apollo/client'
import * as hooks from 'hooks'
import * as utils from 'utils'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import Link from 'next/link'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'
import PageHeader from 'components/PageHeader'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

const GET_ADDRESS = gql`
  query getAddress($id: ID!) {
    address(id: $id) {
      id
      name
    }
  }
`

const DELETE_ADDRESS = gql`
  mutation deleteAddress($id: ID!) {
    deleteAddress(id: $id) {
      address {
        id
      }
    }
  }
`

function AddressPage(props) {
  const router = hooks.useRouter()
  const query = hooks.useQuery(GET_ADDRESS, {variables: {id: router.query.id}, fetchPolicy: 'cache-and-network'})
  const address = query.data?.address

  return (
    <>
      <Head>
        <title>Suitable - Lejemål</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageHeader>Lejemål</PageHeader>
      {query.loading && !address && <CircularProgress />}
      {address && <Address address={address} />}
    </>
  )
}

function Address(props) {
  const {address} = props
  return (
    <>
      <Box pt={2}>
        <Typography>Adresse: {address.name}</Typography>
        <Box pt={2}>
          <DeleteButton address={address} />
        </Box>
      </Box>
    </>
  )
}

const DeleteButton = (props) => {
  const router = hooks.useRouter()
  const client = hooks.useClient()
  const {address} = props
  const [open, setOpen] = React.useState(false)
  const [isDeleting, setDeleting] = React.useState(false)
  const handleClose = () => setOpen(false)
  return (
    <>
      {isDeleting ? (
        <CircularProgress />
      ) : (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            setOpen(true)
          }}
        >
          Slet
        </Button>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`Er du sikker på, at du vil slette adressen "${address.name}" fra din portefølje?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Annullér
          </Button>
          <Button
            onClick={() => {
              setDeleting(true)
              handleClose()
              client
                .mutate({mutation: DELETE_ADDRESS, variables: {id: address.id}})
                .then(() => {
                  router.push('/')
                })
                .catch((error) => {
                  utils.handleError(error)
                  setDeleting(false)
                })
            }}
            color="secondary"
            autoFocus
          >
            Slet
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default AddressPage
