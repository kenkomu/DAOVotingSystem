"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Vote, FileText, CheckCircle, XCircle } from "lucide-react"
import DAOGeometricBackground from "../components/dao-geometric-background"

// Dummy function for demonstration purposes. Replace with your actual implementation.
const connectWallet = async () => ({ address: "0x1234567890abcdef" })

interface Proposal {
  id: number
  title: string
  description: string
  status: string
}

const formatAddress = (addr: string) => {
  return addr ? `${addr.slice(0, 5)}...${addr.slice(-4)}` : ""
}

const checkRegistration = async (address: string) => Math.random() > 0.5
const registerVoter = async (address: string) => true
const getProposals = async (): Promise<Proposal[]> => [
  { id: 1, title: "Proposal 1", description: "Description for Proposal 1", status: "Active" },
  { id: 2, title: "Proposal 2", description: "Description for Proposal 2", status: "Completed" },
]
const createProposal = async (title: string, description: string) => ({ id: 3, title, description, status: "Active" })
const castVote = async (proposalId: number, vote: string) => true
const getResults = async (proposalId: number) => ({ yes: 75, no: 25 })

export default function DAOVotingApp() {
  const [wallet, setWallet] = useState<{ address: string } | null>(null)
  const [isRegistered, setIsRegistered] = useState(false)
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [newProposal, setNewProposal] = useState({ title: "", description: "" })
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null)
  const [voteChoice, setVoteChoice] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [statusType, setStatusType] = useState<"success" | "error" | "info">("success")

  useEffect(() => {
    const connectWalletAutomatically = async () => {
      displayStatusMessage("Attempting to connect to wallet...", "info")
      try {
        const connectedWallet = await connectWallet()
        setWallet(connectedWallet)
        displayStatusMessage(`Wallet Connected: ${connectedWallet.address}`, "success")
      } catch (error) {
        displayStatusMessage("Please connect your wallet manually.", "info")
      }
    }

    connectWalletAutomatically()
  }, [])

  useEffect(() => {
    if (wallet) {
      checkRegistration(wallet.address).then(setIsRegistered)
      getProposals().then(setProposals)
    }
  }, [wallet])

  const displayStatusMessage = (message: string, type: "success" | "error" | "info" = "success") => {
    setStatusMessage(message)
    setStatusType(type)
    setTimeout(() => setStatusMessage(null), 3000)
  }

  const handleConnectWallet = async () => {
    try {
      const connectedWallet = await connectWallet()
      setWallet(connectedWallet)
      displayStatusMessage(`Wallet Connected: ${connectedWallet.address}`, "success")
    } catch (error) {
      displayStatusMessage("Could not connect to wallet.", "error")
    }
  }

  const handleRegister = async () => {
    if (!wallet) return
    try {
      await registerVoter(wallet.address)
      setIsRegistered(true)
      displayStatusMessage("You are now registered as a DAO voter.", "success")
    } catch (error) {
      displayStatusMessage("Could not register as a voter.", "error")
    }
  }

  const handleCreateProposal = async () => {
    try {
      const proposal = await createProposal(newProposal.title, newProposal.description)
      setProposals([...proposals, proposal])
      setNewProposal({ title: "", description: "" })
      displayStatusMessage("Your new proposal has been submitted.", "success")
    } catch (error) {
      displayStatusMessage("Could not create the proposal.", "error")
    }
  }

  const handleVote = async () => {
    if (!selectedProposal || !voteChoice) return
    try {
      await castVote(selectedProposal.id, voteChoice)
      displayStatusMessage("Your anonymous vote has been recorded.", "success")
      setVoteChoice(null)
      setSelectedProposal(null)
    } catch (error) {
      displayStatusMessage("Could not cast your vote.", "error")
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gray-900 text-white">
      <DAOGeometricBackground />
      <div className="relative z-10 container mx-auto p-4">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-6 md:mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
          DAO Voting System
        </h1>

        {statusMessage && (
          <div
            className={`mb-4 p-3 rounded ${
              statusType === "error"
                ? "bg-red-500/20 text-red-200"
                : statusType === "info"
                  ? "bg-blue-500/20 text-blue-200"
                  : "bg-green-500/20 text-green-200"
            }`}
          >
            {statusMessage}
          </div>
        )}

        {!wallet?.address ? (
          <Button
            onClick={handleConnectWallet}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            Connect Wallet
          </Button>
        ) : !isRegistered ? (
          <Button
            onClick={handleRegister}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <CheckCircle className="mr-2 h-4 w-4" /> Register as DAO Voter
          </Button>
        ) : (
          <Tabs defaultValue="proposals" className="w-full">
            <TabsList className="bg-white/10 backdrop-blur-md">
              <TabsTrigger value="proposals">Proposals</TabsTrigger>
              <TabsTrigger value="create">Create Proposal</TabsTrigger>
              <TabsTrigger value="vote">Vote</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
            </TabsList>

            <TabsContent value="proposals">
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle>Active Proposals</CardTitle>
                  <CardDescription>View and select proposals for voting</CardDescription>
                </CardHeader>
                <CardContent>
                  {proposals.map((proposal) => (
                    <Button
                      key={proposal.id}
                      variant="outline"
                      className="w-full mb-2 justify-start bg-gradient-to-r from-blue-500/50 to-purple-500/50 hover:from-blue-600/50 hover:to-purple-600/50"
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
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
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
                        onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
                        className="bg-white/10 border-white/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={newProposal.description}
                        onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
                        className="bg-white/10 border-white/20"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleCreateProposal}
                    className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                  >
                    Create Proposal
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="vote">
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
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
                          variant={voteChoice === "yes" ? "default" : "outline"}
                          onClick={() => setVoteChoice("yes")}
                          className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" /> Yes
                        </Button>
                        <Button
                          variant={voteChoice === "no" ? "default" : "outline"}
                          onClick={() => setVoteChoice("no")}
                          className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
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
                  <Button
                    onClick={handleVote}
                    disabled={!selectedProposal || !voteChoice}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <Vote className="mr-2 h-4 w-4" /> Cast Vote
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="results">
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle>Voting Results</CardTitle>
                  <CardDescription>View results for completed proposals</CardDescription>
                </CardHeader>
                <CardContent>
                  {proposals
                    .filter((p) => p.status === "Completed")
                    .map((proposal) => (
                      <div key={proposal.id} className="mb-4">
                        <h3 className="text-lg font-semibold">{proposal.title}</h3>
                        <div className="flex justify-between mt-2">
                          <span>Yes: 75%</span>
                          <span>No: 25%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
                          <div
                            className="bg-gradient-to-r from-green-500 to-teal-500 h-2.5 rounded-full"
                            style={{ width: "75%" }}
                          ></div>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}

