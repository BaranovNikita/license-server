const express = require('express')
const router = express.Router()
const keygen = require('keygenerator')

const Account = require('../db/models/Account')

const authMiddleware = (req, res, next) => {
  if (req.session.auth) {
    next()
  } else {
    return res.json({
      success: false
    })
  }
}

router.get('/generateKey', authMiddleware, (req, res) => {
  res.json({
    key: keygen._({
      forceUppercase: true,
      length: 28,
      sticks: true
    })
  })
})

router.post('/addAccount', authMiddleware, async (req, res) => {
  const { name, email, licenseKey } = req.body
  const acc = new Account({
    name,
    email: email.toLowerCase(),
    licenseKey
  })
  try {
    await acc.save()
    res.json({
      success: true
    })
  } catch (err) {
    res.json({
      success: false,
      error: err.message
    })
  }
})

router.post('/checkLicense', async (req, res) => {
  const { email, licenseKey, mac } = req.body
  const account = await Account.findOne({
    licenseKey,
    email: email.toLowerCase()
  })
  if (!account) {
    return res.json({
      success: false,
      error: 'Account not found'
    })
  }
  const { pcKey } = account
  if (!pcKey.length) {
    account.pcKey.push({
      key: mac.toUpperCase()
    })
    await account.save()
    return res.json({
      success: true
    })
  }
  const index = pcKey.findIndex(el => el.key === mac.toUpperCase())
  if (index < 0) {
    return res.json({
      success: false,
      error: 'This computer not have access'
    })
  }
  return res.json({
    success: true
  })
})

router.get('/accounts', authMiddleware, async (req, res) => {
  const accounts = await Account.find()
  res.json(accounts)
})

router.patch('/update', authMiddleware, async (req, res) => {
  const { id, newData } = req.body
  const account = await Account.findById(id)
  account.set(newData)
  await account.save()
  res.json({
    success: true
  })
})

router.delete('/delete', authMiddleware, async (req, res) => {
  const { id } = req.body
  await Account.remove({
    _id: id
  })
  res.json({
    success: true
  })
})

router.post('/login', async (req, res) => {
  const { login, password } = req.body
  const { ADMIN } = require('../../../config.json')
  if (login.toUpperCase() === ADMIN.USER.toUpperCase() && password === ADMIN.PASSWORD) {
    req.session.auth = true
    res.json({
      success: true
    })
  } else {
    res.json({
      success: false
    })
  }
})

router.get('/checkLogin', async (req, res) => {
  if (req.session.auth) {
    res.json({
      success: true
    })
  } else {
    res.json({
      success: false
    })
  }
})
module.exports = router
