import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CheckCircle, XCircle, Vote as VoteIcon } from "lucide-react"

interface Proposal {
  id: number
  title: string
  description: string
  status: string
}

interface VoteProps {
  selectedProposal: Proposal | null
  voteChoice: string | null
  setVoteChoice: (choice: string | null) => void
  handleVote: () => void
}

export default function Vote({ selectedProposal, voteChoice, setVoteChoice, handleVote }: VoteProps) {
  return (
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
                variant={voteChoice === "yes" ? "default" : "outline"}
                onClick={() => setVoteChoice("yes")}
              >
                <CheckCircle className="mr-2 h-4 w-4" /> Yes
              </Button>
              <Button
                variant={voteChoice === "no" ? "default" : "outline"}
                onClick={() => setVoteChoice("no")}
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
          <VoteIcon className="mr-2 h-4 w-4" /> Cast Vote
        </Button>
      </CardFooter>
    </Card>
  )
}