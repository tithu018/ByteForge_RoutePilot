# Reserved domain boundaries

The subdirectories reserve the approved future modules: Auth, Users, ReferenceData, Orders, Planning, Fleet, Deferrals, Loading, Delivery, Receipt, Issues, Sync, Operations, CapacityPlanning and Audit.

They are not registered modules, endpoints or working features. Implement only the domain authorized by a later phase, with controllers delegating to services. Allocation belongs in dedicated planning/domain services; synchronization must preserve the approved local-record/reconciliation distinction.
