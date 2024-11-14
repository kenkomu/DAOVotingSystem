'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wallet, Vote, FileText, CheckCircle, XCircle } from 'lucide-react'

// Mock functions for blockchain interactions
const connectWallet = async () => ({ address: '0x1234...5678' })
const checkRegistration = async (address) => Math.random() > 0.5
const registerVoter = async (address) => true
const getProposals = async () => [
  { id: 1, title: 'Proposal 1', description: 'Description for Proposal 1', status: 'Active' },
  { id: 2, title: 'Proposal 2', description: 'Description for Proposal 2', status: 'Completed' },
]
const createProposal = async (title, description) => ({ id: 3, title, description, status: 'Active' })
const castVote = async (proposalId, vote) => true
const getResults = async (proposalId) => ({ yes: 75, no: 25 })


export default function DAOVotingApp() {
  const [wallet, setWallet] = useState(null)
  const [isRegistered, setIsRegistered] = useState(false)
  const [proposals, setProposals] = useState([])
  const [newProposal, setNewProposal] = useState({ title: '', description: '' })
  const [selectedProposal, setSelectedProposal] = useState(null)
  const [voteChoice, setVoteChoice] = useState(null)
  const [statusMessage, setStatusMessage] = useState(null)
  const [statusType, setStatusType] = useState('success')

  useEffect(() => {
    if (wallet) {
      checkRegistration(wallet.address).then(setIsRegistered)
      getProposals().then(setProposals)
    }
  }, [wallet])

  const displayStatusMessage = (message, type = 'success') => {
    setStatusMessage(message)
    setStatusType(type)
    setTimeout(() => setStatusMessage(null), 3000)
  }

  const handleConnectWallet = async () => {
    try {
      const connectedWallet = await connectWallet()
      setWallet(connectedWallet)
      displayStatusMessage(`Wallet Connected: ${connectedWallet.address}`, 'success')
    } catch (error) {
      displayStatusMessage("Could not connect to wallet.", 'error')
    }
  }

  const handleRegister = async () => {
    try {
      await registerVoter(wallet.address)
      setIsRegistered(true)
      displayStatusMessage("You are now registered as a DAO voter.", 'success')
    } catch (error) {
      displayStatusMessage("Could not register as a voter.", 'error')
    }
  }

  const handleCreateProposal = async () => {
    try {
      const proposal = await createProposal(newProposal.title, newProposal.description)
      setProposals([...proposals, proposal])
      setNewProposal({ title: '', description: '' })
      displayStatusMessage("Your new proposal has been submitted.", 'success')
    } catch (error) {
      displayStatusMessage("Could not create the proposal.", 'error')
    }
  }

  const handleVote = async () => {
    try {
      await castVote(selectedProposal.id, voteChoice)
      displayStatusMessage("Your anonymous vote has been recorded.", 'success')
      setVoteChoice(null)
      setSelectedProposal(null)
    } catch (error) {
      displayStatusMessage("Could not cast your vote.", 'error')
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">DAO Voting System</h1>
      
      {statusMessage && (
        <div className={`mb-4 p-3 rounded ${statusType === 'error' ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
          {statusMessage}
        </div>
      )}
      
      {!wallet ? (
        <Button onClick={handleConnectWallet}>
          <Wallet className="mr-2 h-4 w-4" /> Connect Wallet
        </Button>
      ) : !isRegistered ? (
        <Button onClick={handleRegister}>
          <CheckCircle className="mr-2 h-4 w-4" /> Register as DAO Voter
        </Button>
      ) : (
        <Tabs defaultValue="proposals" className="w-full">
          <TabsList>
            <TabsTrigger value="proposals">Proposals</TabsTrigger>
            <TabsTrigger value="create">Create Proposal</TabsTrigger>
            <TabsTrigger value="vote">Vote</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="proposals">
            <Card>
              <CardHeader>
                <CardTitle>Active Proposals</CardTitle>
                <CardDescription>View and select proposals for voting</CardDescription>
              </CardHeader>
              <CardContent>
                {proposals.map(proposal => (
                  <Button
                    key={proposal.id}
                    variant="outline"
                    className="w-full mb-2 justify-start"
                    onClick={() => setSelectedProposal(proposal)}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    {proposal.title}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>Create New Proposal</CardTitle>
                <CardDescription>Submit a new proposal for DAO voting</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newProposal.title}
                      onChange={(e) => setNewProposal({...newProposal, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={newProposal.description}
                      onChange={(e) => setNewProposal({...newProposal, description: e.target.value})}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleCreateProposal}>Create Proposal</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="vote">
            <Card>
              <CardHeader>
                <CardTitle>Cast Your Vote</CardTitle>
                <CardDescription>Vote on the selected proposal</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedProposal ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">{selectedProposal.title}</h3>
                    <p>{selectedProposal.description}</p>
                    <div className="flex space-x-4">
                      <Button
                        variant={voteChoice === 'yes' ? 'default' : 'outline'}
                        onClick={() => setVoteChoice('yes')}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" /> Yes
                      </Button>
                      <Button
                        variant={voteChoice === 'no' ? 'default' : 'outline'}
                        onClick={() => setVoteChoice('no')}
                      >
                        <XCircle className="mr-2 h-4 w-4" /> No
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p>Please select a proposal from the Proposals tab.</p>
                )}
              </CardContent>
              <CardFooter>
                <Button onClick={handleVote} disabled={!selectedProposal || !voteChoice}>
                  <Vote className="mr-2 h-4 w-4" /> Cast Vote
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="results">
            <Card>
              <CardHeader>
                <CardTitle>Voting Results</CardTitle>
                <CardDescription>View results for completed proposals</CardDescription>
              </CardHeader>
              <CardContent>
                {proposals
                  .filter(p => p.status === 'Completed')
                  .map(proposal => (
                    <div key={proposal.id} className="mb-4">
                      <h3 className="text-lg font-semibold">{proposal.title}</h3>
                      <div className="flex justify-between mt-2">
                        <span>Yes: 75%</span>
                        <span>No: 25%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div className="bg-green-600 h-2.5 rounded-full" style={{width: '75%'}}></div>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
