const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
  // Basic Info
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  game: { 
    type: String, 
    required: true,
    enum: ['freefire', 'pubg', 'cod', 'valorant', 'bgmi', 'other'],
    lowercase: true
  },
  gameCustomName: {
    type: String,
    default: null
  },
  description: { 
    type: String, 
    required: true 
  },
  
  // Tournament Image/Banner
  bannerUrl: {
    type: String,
    default: null
  },
  
  // Tournament Type
  type: {
    type: String,
    enum: ['solo', 'duo', 'squad'],
    required: true,
    lowercase: true
  },
  
  // Slots & Pricing
  totalSlots: { 
    type: Number, 
    required: true,
    min: 2,
    max: 1000
  },
  entryFee: { 
    type: Number, 
    required: true,
    min: 0,
    get: v => Math.round(v * 100) / 100,
    set: v => Math.round(v * 100) / 100
  },
  
  // Prize Distribution
  prizePool: { 
    type: Number, 
    required: true,
    min: 0,
    get: v => Math.round(v * 100) / 100,
    set: v => Math.round(v * 100) / 100
  },
  prizes: [{
    position: { type: Number, required: true }, // 1st, 2nd, 3rd etc
    amount: { 
      type: Number, 
      required: true,
      get: v => Math.round(v * 100) / 100,
      set: v => Math.round(v * 100) / 100
    }
  }],
  
  // Schedule
  startTime: { 
    type: Date, 
    required: true 
  },
  endTime: { 
    type: Date, 
    required: true 
  },
  registrationDeadline: { 
    type: Date, 
    required: true 
  },
  
  // Room Details (for game joining)
  roomId: {
    type: String,
    default: null
  },
  roomPassword: {
    type: String,
    default: null
  },
  
  // Map & Rules
  map: {
    type: String,
    default: null
  },
  perspective: {
    type: String,
    enum: ['fpp', 'tpp', 'both', null],
    default: null
  },
  rules: {
    type: String,
    default: null
  },
  
  // Status
  status: {
    type: String,
    enum: ['upcoming', 'registration_open', 'registration_closed', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  
  // Participant tracking
  currentParticipants: {
    type: Number,
    default: 0,
    min: 0
  },
  maxParticipantsPerUser: {
    type: Number,
    default: 1,
    min: 1,
    max: 10
  },
  
  // Results
  resultsPublished: {
    type: Boolean,
    default: false
  },
  winners: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    participantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TournamentParticipant'
    },
    position: Number,
    prize: Number,
    teamName: String,
    kills: {
      type: Number,
      default: 0
    }
  }],
  
  // Requirements
  minLevel: {
    type: Number,
    default: 0,
    min: 0
  },
  verified: {
    type: Boolean,
    default: false
  },
  
  // Platform-specific
  platform: {
    type: String,
    enum: ['android', 'ios', 'pc', 'all'],
    default: 'all'
  },
  
  // Bracket/Match System
  hasBracket: {
    type: Boolean,
    default: false
  },
  
  // Statistics
  totalRevenue: {
    type: Number,
    default: 0,
    get: v => Math.round(v * 100) / 100,
    set: v => Math.round(v * 100) / 100
  },
  
  // Featured/Promoted
  featured: {
    type: Boolean,
    default: false
  },
  
  // Admin notes
  adminNotes: {
    type: String,
    default: null
  },
  
  createdBy: {
    type: String,
    default: 'admin'
  }
}, { 
  timestamps: true,
  toJSON: { getters: true },
  toObject: { getters: true }
});

// Indexes for better query performance
tournamentSchema.index({ status: 1, startTime: 1 });
tournamentSchema.index({ game: 1, status: 1 });
tournamentSchema.index({ featured: 1, status: 1 });
tournamentSchema.index({ startTime: 1 });

// Virtual for slots remaining
tournamentSchema.virtual('slotsRemaining').get(function() {
  return this.totalSlots - this.currentParticipants;
});

// Virtual for is full
tournamentSchema.virtual('isFull').get(function() {
  return this.currentParticipants >= this.totalSlots;
});

// Method to check if registration is open
tournamentSchema.methods.isRegistrationOpen = function() {
  const now = new Date();
  return this.status === 'registration_open' && 
         now < this.registrationDeadline && 
         !this.isFull;
};

// Method to check if user can register
tournamentSchema.methods.canUserRegister = function(userParticipantCount) {
  return this.isRegistrationOpen() && 
         userParticipantCount < this.maxParticipantsPerUser;
};

module.exports = mongoose.model('Tournament', tournamentSchema);
