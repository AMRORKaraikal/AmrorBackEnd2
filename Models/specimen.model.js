import { Schema, model } from 'mongoose'

/*
{ specimen_id, specimen_nature, specimen_source, collection_date, collection_time, illness_duration, specimen_collector, investigation_required, admission_date, physician_name }
*/

const specimenSchema = new Schema({
	specimen_id: {
		type: String,
		required: true,
	},
	patient_id: {
		type: String,
		required: true,
	},
	specimen_nature: {
		type: String,
		required: true,
	},
	specimen_source: {
		type: String,
		required: true,
	},
	collection_date: {
		type: String,
		required: true,
	},
	collection_time: {
		type: String,
		required: true,
	},
	illness_duration: {
		type: String,
		required: true,
	},
	specimen_collector: {
		type: String,
		required: true,
	},
	investigation_required: {
		type: String,
		required: true,
	},
	admission_date: {
		type: String,
		required: true,
	},
	physician_name: {
		type: String,
		required: true,
	},
})

const specimenModel = model('specimen', specimenSchema)

export default specimenModel
