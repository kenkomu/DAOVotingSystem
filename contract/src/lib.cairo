#[starknet::interface]
trait IVotingDAO<TContractState> {
    fn vote(ref self: TContractState, proposal_id: u64, vote: u8);
    fn get_result(self: @TContractState) -> (u8, u8);
}



#[starknet::contract]
mod VotingDAO{
    // use starknet::storage::StoragePathEntry;
    use core::starknet::{ContractAddress, get_caller_address};
    use core::starknet::storage::{
        Map, StoragePathEntry, StoragePointerWriteAccess, StoragePointerReadAccess
    };

    const YES: u8 = 1_u8;
    const NO: u8 = 0_u8;

    #[storage]
    struct Storage {
        id: u64,
        description: felt252,
        yes_votes: u8,
        no_votes: u8,
        has_voted: Map<ContractAddress, bool>
    }


    #[constructor]
    fn constructor(ref self: ContractState, proposal_id: u64, description: felt252) {
        self.id.write(proposal_id);
        self.description.write(description);
    }


    #[abi(embed_v0)]
    impl VotingDAO of super::IVotingDAO<ContractState> {
        fn vote(ref self: ContractState, proposal_id: u64, vote: u8) {
            let caller_address = get_caller_address();
            let can_cast_vote = self.has_voted.entry(caller_address);
            if vote == YES && !can_cast_vote.read() {
                let yes = self.yes_votes.read();
                self.yes_votes.write(yes + 1);
                self.has_voted.entry(caller_address).write(true);
            } 
            if vote == NO && !can_cast_vote.read() {
                let no = self.no_votes.read();
                self.no_votes.write(no + 1);
                self.has_voted.entry(caller_address).write(true);
            }
        }


        fn get_result(self: @ContractState) -> (u8, u8) {
            (self.yes_votes.read(), self.no_votes.read())
        }
    }
}