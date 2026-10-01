import { Navigate, Route, Routes } from 'react-router';
import {
  DeferredOrder,
  DeleteOrderDialog,
  EditOrder,
  FreshOrder,
  HistoryIssues,
  IssueDetail,
  MessageDispatcherDialog,
  Notifications,
  OrderDetail,
  OrderFailed,
  OrderStatus,
  OrderSubmitted,
  ReceiptRecorded,
  ReceiveArrival,
  ReceiveProducts,
  Settings,
  StoreDashboard,
  StyleOrder,
  StyleReceive,
  TechOrder,
  TechReceive,
} from './store';
import {
  CantDeliverDialog,
  DriverDisplay,
  DriverNavigation,
  DriverToday,
  DriveMode,
  DriveModeNight,
  OfflineDriveMode,
  OfflineSaved,
  OfflineStop,
  ReportProblemDialog,
  StopDelivered,
  StopDetails,
  SyncConflict,
  SyncNeedsReview,
  SyncUpToDate,
  TripComplete,
  TripNotSynced,
} from './driver';
import {
  CapacityForecast,
  CaseResolved,
  DeferralDecisionDialog,
  DeferralLog,
  DispatcherIssue,
  DraftPlan,
  FixedPlan,
  LiveBoard,
  MoveOutletDialog,
  NeedsAttention,
  OrderQueue,
  PublishedPlan,
  PublishReview,
  PublishV2,
  ReferenceData,
  VehicleUnavailable,
} from './dispatcher';
import {
  BeforeAmbient,
  BeforeChilled,
  ConnectionDrop,
  FlagProblemDialog,
  Loaded,
  LoadingChecklist,
  LoadingIssues,
  LoadSummary,
  PlanChanged,
  ReassignedLoaded,
  Reverify,
  TripQueue,
} from './loader';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/store/sm01" replace />} />
      <Route path="/store/sm01" element={<StoreDashboard />} />
      <Route path="/store/sm02" element={<FreshOrder />} />
      <Route path="/store/sm03" element={<OrderSubmitted />} />
      <Route path="/store/sm04" element={<OrderFailed />} />
      <Route path="/store/sm05" element={<OrderStatus />} />
      <Route path="/store/sm06" element={<OrderDetail />} />
      <Route path="/store/sm07" element={<EditOrder />} />
      <Route path="/store/sm08" element={<DeferredOrder />} />
      <Route path="/store/sm-o1" element={<DeleteOrderDialog />} />
      <Route path="/store/sm09" element={<ReceiveArrival />} />
      <Route path="/store/sm10" element={<ReceiveProducts />} />
      <Route path="/store/sm11" element={<ReceiptRecorded />} />
      <Route path="/store/sm12" element={<HistoryIssues />} />
      <Route path="/store/sm13" element={<IssueDetail />} />
      <Route path="/store/sm14" element={<Notifications />} />
      <Route path="/store/sm15" element={<Settings />} />
      <Route path="/store/sm-o2" element={<MessageDispatcherDialog />} />
      <Route path="/store/st02" element={<StyleOrder />} />
      <Route path="/store/st09" element={<StyleReceive />} />
      <Route path="/store/te02" element={<TechOrder />} />
      <Route path="/store/te09" element={<TechReceive />} />
      <Route path="/driver/dr01" element={<DriverToday />} />
      <Route path="/driver/dr02" element={<DriveMode />} />
      <Route path="/driver/dr03" element={<DriverNavigation />} />
      <Route path="/driver/dr04" element={<StopDetails />} />
      <Route path="/driver/dr-o1" element={<CantDeliverDialog />} />
      <Route path="/driver/dr-o2" element={<ReportProblemDialog />} />
      <Route path="/driver/dr05" element={<StopDelivered />} />
      <Route path="/driver/dr06" element={<OfflineDriveMode />} />
      <Route path="/driver/dr07" element={<OfflineStop />} />
      <Route path="/driver/dr08" element={<OfflineSaved />} />
      <Route path="/driver/dr09" element={<SyncNeedsReview />} />
      <Route path="/driver/dr10" element={<SyncConflict />} />
      <Route path="/driver/dr11" element={<SyncUpToDate />} />
      <Route path="/driver/dr12" element={<TripComplete />} />
      <Route path="/driver/dr13" element={<TripNotSynced />} />
      <Route path="/driver/dr14" element={<DriverDisplay />} />
      <Route path="/driver/dr15" element={<DriveModeNight />} />

      <Route path="/dispatcher/dp01" element={<OrderQueue />} />
      <Route path="/dispatcher/dp02" element={<DraftPlan />} />
      <Route path="/dispatcher/dp-o1" element={<MoveOutletDialog />} />
      <Route path="/dispatcher/dp-o2" element={<DeferralDecisionDialog />} />
      <Route path="/dispatcher/dp03" element={<FixedPlan />} />
      <Route path="/dispatcher/dp04" element={<PublishReview />} />
      <Route path="/dispatcher/dp05" element={<PublishedPlan />} />
      <Route path="/dispatcher/dp06" element={<VehicleUnavailable />} />
      <Route path="/dispatcher/dp07" element={<PublishV2 />} />
      <Route path="/dispatcher/dp08" element={<LiveBoard />} />
      <Route path="/dispatcher/dp09" element={<NeedsAttention />} />
      <Route path="/dispatcher/dp10" element={<DispatcherIssue />} />
      <Route path="/dispatcher/dp11" element={<CaseResolved />} />
      <Route path="/dispatcher/dp12" element={<DeferralLog />} />
      <Route path="/dispatcher/dp13" element={<CapacityForecast />} />
      <Route path="/dispatcher/dp14" element={<ReferenceData />} />

      <Route path="/loader/ld01" element={<TripQueue />} />
      <Route path="/loader/ld02" element={<BeforeAmbient />} />
      <Route path="/loader/ld03" element={<LoadingChecklist />} />
      <Route path="/loader/ld-o1" element={<FlagProblemDialog />} />
      <Route path="/loader/ld04" element={<LoadSummary />} />
      <Route path="/loader/ld05" element={<Loaded />} />
      <Route path="/loader/ld06" element={<BeforeChilled />} />
      <Route path="/loader/ld07" element={<ConnectionDrop />} />
      <Route path="/loader/ld08" element={<PlanChanged />} />
      <Route path="/loader/ld09" element={<Reverify />} />
      <Route path="/loader/ld10" element={<ReassignedLoaded />} />
      <Route path="/loader/ld11" element={<LoadingIssues />} />
      <Route path="*" element={<Navigate to="/store/sm01" replace />} />
    </Routes>
  );
}
