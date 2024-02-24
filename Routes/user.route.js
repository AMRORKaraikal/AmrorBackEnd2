import { Router } from 'express'
import userModel from '../Models/user.model.js'
import patientModel from '../Models/patient.model.js'
import specimenModel from '../Models/specimen.model.js'
import reportModel from '../Models/report.model.js'
const router = Router()

const login = async (req, res, next) => {
	const { username, password } = req.body

	try {
		console.log(username)
		// const users = await userModel.find({})
		const user = await userModel.findOne({ username }).select('+password') // if user exists then give me his/her password
		// console.log(users)
		console.log(user)
		// const user = await User.findOne({ "email":email },{"_id":0,"password":1,"email":1}); // if user exists then give me his/her password
		// console.log("user->",user)

		if (!user) {
			return next(new AppError('Email doesnt exist!', 400))
		}
		const isPasswordValid = password === user.password

		if (!isPasswordValid) {
			return alert('Incorrect Password!')
		}

		res.status(200).json({
			success: true,
			message: 'User loggedIn successfully',
			user,
		})
	} catch (e) {
		return res.status(500).json({
			success: false,
			message: e,
		})
	}
}

const specimenRegister = async (req, res, next) => {
	try {
		let { patient_data, specimen_data } = req.body
		let gender = patient_data.gender

		const count = (await patientModel.countDocuments({ gender: gender })) + 1

		// Generate patient ID
		let patientId = ''
		const digits = 6 - count.toString().length
		const year = new Date().getFullYear() % 100

		const arr = Array.from({ length: digits }, () => '0')

		let gen = ''
		if (gender === 'Male') {
			gen = 'M'
		} else if (gender === 'Female') {
			gen = 'F'
		} else {
			gen = 'O'
		}

		patientId = patientId + [gen, year, ...arr, count].join('')

		console.log(patientId)

		patient_data = {
			...patient_data,
			patient_id: patientId,
		}

		specimen_data = {
			...specimen_data,
			patient_id: patientId,
		}

		await patientModel.insertMany(patient_data)
		await specimenModel.insertMany(specimen_data)

		res.status(201).json({
			success: true,
			message: 'Data Added Successfully!',
			patientId,
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			success: false,
			message: error.message,
		})
	}
}
const specimenNumber = async (req, res, next) => {
	try {
		const count = (await specimenModel.countDocuments({})) + 1
		console.log(count)

		res.status(201).json({
			success: true,
			message: 'Data Added Successfully!',
			count,
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			success: false,
			message: error.message,
		})
	}
}

const reportRegister = async (req, res, next) => {
	try {
		const { report_data } = req.body
		console.log(report_data)
		await reportModel.insertMany(report_data)

		res.status(201).json({
			success: true,
			message: 'Report Added Successfully!',
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			success: false,
			message: error.message,
		})
	}
}

const getReport = async (req, res, next) => {
	try {
		let { patient_id, specimen_id } = req.body

		let report = await reportModel.findOne(
			{ patient_id, specimen_id },
			{ _id: 0 }
		)
		let patientData = await patientModel.findOne({ patient_id }, { _id: 0 })
		let specimenData = await specimenModel.findOne(
			{ patient_id, specimen_id },
			{ _id: 0 }
		)
		res.status(201).json({
			success: true,
			message: 'Fetched Report Successfully!',
			report: report,
			patientData: patientData,
			specimenData: specimenData,
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			success: false,
			message: error.message,
		})
	}
}
const getDetails = async (req, res, next) => {
	try {
		let { patient_id, specimen_id } = req.body
		console.log(patient_id)
		console.log(specimen_id)

		let patientData = await patientModel.findOne(
			{ patient_id: patient_id },
			{ _id: 0 }
		)

		let specimenData = await specimenModel.findOne(
			{ patient_id: patient_id, specimen_id: specimen_id },
			{ _id: 0 }
		)
		console.log(specimenData)
		res.status(201).json({
			success: true,
			message: 'Fetched Report Successfully!',

			patientData: patientData,
			specimenData: specimenData,
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			success: false,
			message: error.message,
		})
	}
}
const getPatientHistory = async (req, res, next) => {
	try {
		let { patient_id, specimen_id } = req.body

		let patientData = await patientModel.findOne({ patient_id }, { _id: 0 })
		let specimenData = await specimenModel.find(
			{ patient_id, specimen_id },
			{ _id: 0 }
		)
		res.status(201).json({
			success: true,
			message: 'Fetched Patient History Successfully!',
			patientData: patientData,
			specimenData: specimenData,
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			success: false,
			message: error.message,
		})
	}
}

router.post('/login', login)
router.post('/new-specimen', specimenRegister)
router.post('/specimen-id', specimenNumber)
router.post('/new-report', reportRegister)
router.post('/get-report-details', getDetails)

router.post('/get-report', getReport)

// router.post('/get-patient-data', getPatientHistory)

export default router
